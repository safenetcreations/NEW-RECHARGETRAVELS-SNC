import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  CheckCircle,
  User,
  Car,
  FileText,
  Camera,
  Shield,
  ArrowLeft,
  ArrowRight,
  Loader2,
  AlertCircle,
  Phone,
  Mail,
  Globe,
  Award,
  Upload,
  Briefcase
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/ui/RechargeFooter';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { registerDriver, uploadDriverFile, getDriverByUserId } from '@/services/driverService';

// Simplified Form Schema - 3 Steps
const driverSchema = z.object({
  // Step 1: Basic Info
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  shortName: z.string().min(2, 'Display name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  whatsapp: z.string().min(10, 'WhatsApp number is required'),

  // Step 2: Credentials
  licenseNumber: z.string().min(5, 'Driving license number is required'),
  sltdaLicenseNumber: z.string().optional(),
  tourGuideLicenseNumber: z.string().optional(),
  yearsExperience: z.number().min(1, 'At least 1 year required').max(50),
  bio: z.string().min(30, 'Bio must be at least 30 characters'),

  // Step 3: Vehicle
  vehiclePreference: z.enum(['own_vehicle', 'company_vehicle', 'any_vehicle']),
  vehicleType: z.string().optional(),
  vehicleMake: z.string().optional(),
  vehicleModel: z.string().optional(),
  vehicleYear: z.number().optional(),
  vehicleSeats: z.number().optional(),
  vehicleRegistration: z.string().optional()
});

type DriverFormData = z.infer<typeof driverSchema>;

const languageOptions = [
  'English', 'Sinhala', 'Tamil', 'German', 'French',
  'Spanish', 'Italian', 'Japanese', 'Chinese', 'Russian', 'Hindi'
];

const specialtyOptions = [
  'Wildlife Safaris', 'Cultural Tours', 'Beach Tours', 'Hill Country',
  'Photography Tours', 'Adventure Tours', 'Airport Transfers', 'City Tours'
];

const vehicleFeatureOptions = [
  'Air Conditioning', 'WiFi', 'USB Charging', 'Cooler Box',
  'First Aid Kit', 'GPS', 'Child Seat', 'Luggage Space'
];

const DriverRegistrationPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingDriver, setExistingDriver] = useState<any>(null);
  const [checkingExisting, setCheckingExisting] = useState(true);

  // Multi-select states
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['English']);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedVehicleFeatures, setSelectedVehicleFeatures] = useState<string[]>([]);

  // File uploads
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File>>({});

  const form = useForm<DriverFormData>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      shortName: '',
      email: user?.email || '',
      phone: '',
      whatsapp: '',
      licenseNumber: '',
      sltdaLicenseNumber: '',
      tourGuideLicenseNumber: '',
      yearsExperience: 1,
      bio: '',
      vehiclePreference: 'own_vehicle',
      vehicleType: '',
      vehicleMake: '',
      vehicleModel: '',
      vehicleYear: new Date().getFullYear(),
      vehicleSeats: 4,
      vehicleRegistration: ''
    }
  });

  const vehiclePreference = form.watch('vehiclePreference');

  // Check if user already has a driver profile
  useEffect(() => {
    const checkExistingProfile = async () => {
      if (user) {
        const existing = await getDriverByUserId(user.uid);
        if (existing) {
          setExistingDriver(existing);
        }
      }
      setCheckingExisting(false);
    };
    checkExistingProfile();
  }, [user]);

  // 3 Simple Steps
  const steps = [
    { number: 1, title: 'Basic Info', icon: User, description: 'Your contact details' },
    { number: 2, title: 'Credentials', icon: Award, description: 'License & experience' },
    { number: 3, title: 'Vehicle & Photo', icon: Car, description: 'Vehicle & profile' }
  ];

  const handleFileUpload = (documentType: string, file: File) => {
    setUploadedFiles(prev => ({ ...prev, [documentType]: file }));
  };

  const toggleSelection = (item: string, selected: string[], setSelected: React.Dispatch<React.SetStateAction<string[]>>) => {
    setSelected(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async (data: DriverFormData) => {
    if (!user) {
      toast.error('Please log in to register as a driver');
      navigate('/login');
      return;
    }

    if (selectedLanguages.length === 0) {
      toast.error('Please select at least one language');
      return;
    }

    if (!uploadedFiles.profilePhoto) {
      toast.error('Please upload a profile photo');
      return;
    }

    if (!uploadedFiles.drivingLicense) {
      toast.error('Please upload your driving license');
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload documents
      const documentUrls: Record<string, string> = {};
      for (const [docType, file] of Object.entries(uploadedFiles)) {
        if (file) {
          const url = await uploadDriverFile(user.uid, file, 'document');
          documentUrls[docType] = url;
        }
      }

      // Prepare driver data
      const driverData = {
        ...data,
        languages: selectedLanguages,
        specialties: selectedSpecialties,
        documents: documentUrls,
        heroImages: [],
        vehicleImages: [],
        ownVehicle:
          data.vehiclePreference === 'own_vehicle'
            ? {
                type: data.vehicleType || '',
                make: data.vehicleMake || '',
                model: data.vehicleModel || '',
                year: data.vehicleYear || new Date().getFullYear(),
                seats: data.vehicleSeats || 4,
                features: selectedVehicleFeatures,
                registrationNumber: data.vehicleRegistration || ''
              }
            : undefined
      };

      const result = await registerDriver(user.uid, driverData);

      if (result.success) {
        toast.success('Registration submitted! We will review your application within 24-48 hours.');
        navigate('/driver/dashboard');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Failed to submit registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = (currentStep / steps.length) * 100;

  // Login required screen
  if (!user && !checkingExisting) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-16">
          <div className="container mx-auto px-4">
            <Card className="max-w-md mx-auto shadow-xl">
              <CardContent className="pt-8 text-center">
                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-10 h-10 text-amber-500" />
                </div>
                <h2 className="text-2xl font-bold mb-3">Login Required</h2>
                <p className="text-slate-600 mb-6">
                  Please log in or create an account to register as a driver.
                </p>
                <Button onClick={() => navigate('/login')} size="lg" className="w-full">
                  Go to Login
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Existing profile screen
  if (existingDriver) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-16">
          <div className="container mx-auto px-4">
            <Card className="max-w-md mx-auto shadow-xl">
              <CardContent className="pt-8 text-center">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-bold mb-3">Profile Exists</h2>
                <p className="text-slate-600 mb-4">
                  You already have a driver profile registered.
                </p>
                <Badge
                  className={`text-sm px-4 py-1 ${
                    existingDriver.status === 'approved'
                      ? 'bg-emerald-500'
                      : existingDriver.status === 'pending'
                      ? 'bg-amber-500'
                      : 'bg-red-500'
                  }`}
                >
                  Status: {existingDriver.status?.toUpperCase()}
                </Badge>
                <div className="mt-6">
                  <Button onClick={() => navigate('/driver/dashboard')} size="lg" className="w-full">
                    Go to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (checkingExisting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Driver Registration | Join Recharge Travels</title>
        <meta
          name="description"
          content="Register as a professional driver with Recharge Travels in just 3 simple steps."
        />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Header */}
          <div className="text-center mb-8">
            <Badge className="bg-emerald-500 text-white mb-4">
              <Shield className="w-3 h-3 mr-1" />
              Quick Registration
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
              Become a Driver
            </h1>
            <p className="text-slate-600">
              Join our network in just 3 simple steps
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex justify-between items-start mb-6">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;

                return (
                  <div key={step.number} className="flex flex-col items-center flex-1 relative">
                    {/* Connector line */}
                    {index < steps.length - 1 && (
                      <div
                        className={`absolute top-6 left-1/2 w-full h-1 -z-10 ${
                          isCompleted ? 'bg-emerald-500' : 'bg-slate-200'
                        }`}
                      />
                    )}

                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all shadow-md ${
                        isCompleted
                          ? 'bg-emerald-500 text-white'
                          : isActive
                          ? 'bg-orange-500 text-white ring-4 ring-orange-200'
                          : 'bg-white text-slate-400 border-2 border-slate-200'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    <span className={`text-sm font-semibold ${isActive ? 'text-orange-600' : 'text-slate-600'}`}>
                      {step.title}
                    </span>
                    <span className="text-xs text-slate-400 hidden md:block">{step.description}</span>
                  </div>
                );
              })}
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Form Card */}
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                {(() => {
                  const Icon = steps[currentStep - 1].icon;
                  return <Icon className="w-5 h-5" />;
                })()}
                Step {currentStep}: {steps[currentStep - 1].title}
              </CardTitle>
              <CardDescription className="text-slate-300">
                {steps[currentStep - 1].description}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6">
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">

                {/* STEP 1: Basic Info */}
                {currentStep === 1 && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName" className="flex items-center gap-1">
                          <User className="w-4 h-4" /> First Name *
                        </Label>
                        <Input {...form.register('firstName')} className="mt-1" placeholder="John" />
                        {form.formState.errors.firstName && (
                          <p className="text-sm text-red-500 mt-1">{form.formState.errors.firstName.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input {...form.register('lastName')} className="mt-1" placeholder="Doe" />
                        {form.formState.errors.lastName && (
                          <p className="text-sm text-red-500 mt-1">{form.formState.errors.lastName.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="shortName">Display Name (shown to customers) *</Label>
                      <Input {...form.register('shortName')} className="mt-1" placeholder="e.g., Kenny, Nimal" />
                      <p className="text-xs text-slate-500 mt-1">This is how customers will see your name</p>
                      {form.formState.errors.shortName && (
                        <p className="text-sm text-red-500 mt-1">{form.formState.errors.shortName.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email" className="flex items-center gap-1">
                        <Mail className="w-4 h-4" /> Email Address *
                      </Label>
                      <Input type="email" {...form.register('email')} className="mt-1" />
                      {form.formState.errors.email && (
                        <p className="text-sm text-red-500 mt-1">{form.formState.errors.email.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone" className="flex items-center gap-1">
                          <Phone className="w-4 h-4" /> Phone Number *
                        </Label>
                        <Input {...form.register('phone')} className="mt-1" placeholder="+94 77 123 4567" />
                        {form.formState.errors.phone && (
                          <p className="text-sm text-red-500 mt-1">{form.formState.errors.phone.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="whatsapp">WhatsApp Number *</Label>
                        <Input {...form.register('whatsapp')} className="mt-1" placeholder="+94 77 123 4567" />
                        {form.formState.errors.whatsapp && (
                          <p className="text-sm text-red-500 mt-1">{form.formState.errors.whatsapp.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Quick Info Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                        <Shield className="w-4 h-4" /> Why Join Recharge?
                      </h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>✓ Get verified and receive more bookings</li>
                        <li>✓ Set your own rates and availability</li>
                        <li>✓ 24/7 support from our team</li>
                        <li>✓ Free registration - no hidden fees</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* STEP 2: Credentials & Documents */}
                {currentStep === 2 && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="licenseNumber">Driving License Number *</Label>
                        <Input {...form.register('licenseNumber')} className="mt-1" placeholder="DL-XXXXXX" />
                        {form.formState.errors.licenseNumber && (
                          <p className="text-sm text-red-500 mt-1">{form.formState.errors.licenseNumber.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="yearsExperience">Years of Experience *</Label>
                        <Input
                          type="number"
                          min="1"
                          max="50"
                          {...form.register('yearsExperience', { valueAsNumber: true })}
                          className="mt-1"
                        />
                        {form.formState.errors.yearsExperience && (
                          <p className="text-sm text-red-500 mt-1">{form.formState.errors.yearsExperience.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="sltdaLicenseNumber">SLTDA License (optional)</Label>
                        <Input {...form.register('sltdaLicenseNumber')} className="mt-1" placeholder="SLTDA-XXXX" />
                        <p className="text-xs text-slate-500 mt-1">Leave empty if not applicable</p>
                      </div>
                      <div>
                        <Label htmlFor="tourGuideLicenseNumber">Tour Guide License (optional)</Label>
                        <Input {...form.register('tourGuideLicenseNumber')} className="mt-1" placeholder="TG-XXXX" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="bio">About You *</Label>
                      <Textarea
                        {...form.register('bio')}
                        className="mt-1"
                        rows={3}
                        placeholder="Tell customers about your experience and what makes you a great driver..."
                      />
                      {form.formState.errors.bio && (
                        <p className="text-sm text-red-500 mt-1">{form.formState.errors.bio.message}</p>
                      )}
                    </div>

                    {/* Languages */}
                    <div>
                      <Label className="mb-2 block flex items-center gap-1">
                        <Globe className="w-4 h-4" /> Languages Spoken *
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {languageOptions.map(lang => (
                          <Badge
                            key={lang}
                            variant={selectedLanguages.includes(lang) ? 'default' : 'outline'}
                            className={`cursor-pointer transition-all ${
                              selectedLanguages.includes(lang)
                                ? 'bg-emerald-500 hover:bg-emerald-600'
                                : 'hover:bg-slate-100'
                            }`}
                            onClick={() => toggleSelection(lang, selectedLanguages, setSelectedLanguages)}
                          >
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Specialties */}
                    <div>
                      <Label className="mb-2 block">Tour Specialties (optional)</Label>
                      <div className="flex flex-wrap gap-2">
                        {specialtyOptions.map(specialty => (
                          <Badge
                            key={specialty}
                            variant={selectedSpecialties.includes(specialty) ? 'default' : 'outline'}
                            className={`cursor-pointer transition-all ${
                              selectedSpecialties.includes(specialty)
                                ? 'bg-orange-500 hover:bg-orange-600'
                                : 'hover:bg-slate-100'
                            }`}
                            onClick={() => toggleSelection(specialty, selectedSpecialties, setSelectedSpecialties)}
                          >
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Document Upload */}
                    <div className="bg-slate-50 rounded-lg p-4 space-y-4">
                      <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Required Documents
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded-lg p-3 bg-white">
                          <Label className="text-sm">Driving License *</Label>
                          <Input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={e => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload('drivingLicense', file);
                            }}
                            className="mt-1"
                          />
                          {uploadedFiles.drivingLicense && (
                            <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> Uploaded
                            </p>
                          )}
                        </div>

                        <div className="border rounded-lg p-3 bg-white">
                          <Label className="text-sm">Police Clearance (optional)</Label>
                          <Input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={e => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload('policeReport', file);
                            }}
                            className="mt-1"
                          />
                          {uploadedFiles.policeReport && (
                            <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> Uploaded
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: Vehicle & Photos */}
                {currentStep === 3 && (
                  <div className="space-y-5">
                    {/* Profile Photo */}
                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-6 text-center">
                      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg overflow-hidden">
                        {uploadedFiles.profilePhoto ? (
                          <img
                            src={URL.createObjectURL(uploadedFiles.profilePhoto)}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Camera className="w-10 h-10 text-slate-300" />
                        )}
                      </div>
                      <Label className="font-semibold">Profile Photo *</Label>
                      <p className="text-xs text-slate-500 mb-3">Upload a clear, professional photo</p>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload('profilePhoto', file);
                        }}
                        className="max-w-xs mx-auto"
                      />
                    </div>

                    {/* Vehicle Preference */}
                    <div>
                      <Label className="mb-2 block">Vehicle Preference *</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {[
                          { value: 'own_vehicle', label: 'My Own Vehicle', icon: Car, desc: 'I have my own car' },
                          { value: 'company_vehicle', label: 'Recharge Fleet', icon: Briefcase, desc: 'Drive company cars' },
                          { value: 'any_vehicle', label: 'Any Vehicle', icon: CheckCircle, desc: 'Can drive any' }
                        ].map(option => (
                          <div
                            key={option.value}
                            onClick={() => form.setValue('vehiclePreference', option.value as any)}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all text-center ${
                              vehiclePreference === option.value
                                ? 'border-orange-500 bg-orange-50'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <option.icon className={`w-8 h-8 mx-auto mb-2 ${
                              vehiclePreference === option.value ? 'text-orange-500' : 'text-slate-400'
                            }`} />
                            <p className="font-semibold text-sm">{option.label}</p>
                            <p className="text-xs text-slate-500">{option.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Vehicle Details (if own vehicle) */}
                    {vehiclePreference === 'own_vehicle' && (
                      <div className="bg-slate-50 rounded-lg p-4 space-y-4">
                        <h4 className="font-semibold text-slate-800">Your Vehicle Details</h4>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div>
                            <Label className="text-sm">Type</Label>
                            <Select
                              value={form.watch('vehicleType')}
                              onValueChange={(value) => form.setValue('vehicleType', value)}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Sedan">Sedan</SelectItem>
                                <SelectItem value="SUV">SUV</SelectItem>
                                <SelectItem value="Van">Van</SelectItem>
                                <SelectItem value="Mini Coach">Mini Coach</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-sm">Make</Label>
                            <Input {...form.register('vehicleMake')} className="mt-1" placeholder="Toyota" />
                          </div>
                          <div>
                            <Label className="text-sm">Model</Label>
                            <Input {...form.register('vehicleModel')} className="mt-1" placeholder="Prado" />
                          </div>
                          <div>
                            <Label className="text-sm">Seats</Label>
                            <Input
                              type="number"
                              min="2"
                              max="50"
                              {...form.register('vehicleSeats', { valueAsNumber: true })}
                              className="mt-1"
                            />
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm">Registration Number</Label>
                          <Input {...form.register('vehicleRegistration')} className="mt-1" placeholder="CAB-1234" />
                        </div>

                        <div>
                          <Label className="text-sm mb-2 block">Features</Label>
                          <div className="flex flex-wrap gap-2">
                            {vehicleFeatureOptions.map(feature => (
                              <Badge
                                key={feature}
                                variant={selectedVehicleFeatures.includes(feature) ? 'default' : 'outline'}
                                className={`cursor-pointer text-xs ${
                                  selectedVehicleFeatures.includes(feature)
                                    ? 'bg-teal-500 hover:bg-teal-600'
                                    : ''
                                }`}
                                onClick={() => toggleSelection(feature, selectedVehicleFeatures, setSelectedVehicleFeatures)}
                              >
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Vehicle Photo */}
                        <div className="border rounded-lg p-3 bg-white">
                          <Label className="text-sm">Vehicle Photo (optional)</Label>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={e => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload('vehiclePhoto', file);
                            }}
                            className="mt-1"
                          />
                          {uploadedFiles.vehiclePhoto && (
                            <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> Uploaded
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Final Info Box */}
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                      <h4 className="font-semibold text-emerald-800 mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" /> Almost Done!
                      </h4>
                      <ul className="text-sm text-emerald-700 space-y-1">
                        <li>• Your application will be reviewed within 24-48 hours</li>
                        <li>• We'll send you an email once approved</li>
                        <li>• You can start receiving bookings immediately after approval</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="px-6"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>

                  {currentStep < steps.length ? (
                    <Button type="button" onClick={nextStep} className="px-6 bg-orange-500 hover:bg-orange-600">
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 bg-emerald-500 hover:bg-emerald-600"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Submit Registration
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Trust Indicators */}
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-center text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Free Registration</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-500" />
              <span>Get Verified Badge</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default DriverRegistrationPage;
