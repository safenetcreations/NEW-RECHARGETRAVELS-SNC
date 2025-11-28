import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Building2,
    User,
    FileText,
    DollarSign,
    Calendar,
    Image as ImageIcon,
    CheckCircle,
    ChevronRight,
    ChevronLeft,
    Briefcase,
    MapPin,
    ShieldCheck,
    Sparkles,
    Loader2,
    Phone,
    Mail,
    Globe,
    Camera,
    Upload,
    X,
    MessageCircle,
    Star,
    Award,
    Zap,
    Coffee,
    Utensils,
    Bed,
    Compass,
    Mountain,
    Waves,
    TreePine,
    Car,
    Ship,
    Plane,
    HelpCircle,
    Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFunctions, httpsCallable } from 'firebase/functions';

// Service Categories with icons
const serviceCategories = [
    { id: 'tours', label: 'Tours & Excursions', icon: Compass, description: 'Guided tours, day trips, multi-day tours' },
    { id: 'accommodation', label: 'Accommodation', icon: Bed, description: 'Hotels, villas, guesthouses, homestays' },
    { id: 'transport', label: 'Transportation', icon: Car, description: 'Vehicles, drivers, airport transfers' },
    { id: 'activities', label: 'Activities & Adventures', icon: Mountain, description: 'Safari, hiking, water sports, cycling' },
    { id: 'wellness', label: 'Wellness & Ayurveda', icon: Coffee, description: 'Spa, Ayurveda treatments, yoga retreats' },
    { id: 'dining', label: 'Food & Dining', icon: Utensils, description: 'Restaurants, cooking classes, food tours' },
    { id: 'wildlife', label: 'Wildlife & Nature', icon: TreePine, description: 'Safari, bird watching, nature walks' },
    { id: 'water_sports', label: 'Water Activities', icon: Waves, description: 'Diving, surfing, whale watching, boat tours' },
    { id: 'cultural', label: 'Cultural Experiences', icon: Award, description: 'Temple visits, cultural shows, crafts' },
    { id: 'photography', label: 'Photography Tours', icon: Camera, description: 'Photo tours, drone services' },
];

// Sri Lanka Locations
const sriLankaLocations = [
    'Colombo', 'Kandy', 'Galle', 'Sigiriya', 'Ella', 'Nuwara Eliya',
    'Mirissa', 'Unawatuna', 'Bentota', 'Negombo', 'Trincomalee',
    'Jaffna', 'Anuradhapura', 'Polonnaruwa', 'Dambulla', 'Hikkaduwa',
    'Arugam Bay', 'Yala', 'Udawalawe', 'Wilpattu', 'Horton Plains',
    'Adams Peak', 'Kitulgala', 'Habarana', 'Pasikuda', 'Batticaloa',
    'Tangalle', 'Weligama', 'Matara', 'Hambantota', 'Ratnapura'
];

// Steps definition
const steps = [
    { id: 1, title: 'Welcome', icon: Sparkles, description: 'Get started with your vendor journey' },
    { id: 2, title: 'Personal Info', icon: User, description: 'Your contact information' },
    { id: 3, title: 'Identity', icon: ShieldCheck, description: 'Verify your identity' },
    { id: 4, title: 'Business', icon: Building2, description: 'Business details' },
    { id: 5, title: 'Service', icon: Briefcase, description: 'What you offer' },
    { id: 6, title: 'Pricing', icon: DollarSign, description: 'Set your prices' },
    { id: 7, title: 'Availability', icon: Calendar, description: 'When are you available' },
    { id: 8, title: 'Documents', icon: FileText, description: 'Upload required docs' },
    { id: 9, title: 'Photos', icon: ImageIcon, description: 'Showcase your service' },
    { id: 10, title: 'Review', icon: CheckCircle, description: 'Submit your application' },
];

// AI Suggestions for service descriptions
const aiSuggestions: Record<string, string[]> = {
    tours: [
        "Discover the hidden gems of Sri Lanka with our expertly guided tours...",
        "Experience authentic local culture with our immersive day trips...",
        "Journey through ancient kingdoms and pristine landscapes..."
    ],
    accommodation: [
        "Wake up to breathtaking views in our carefully curated accommodation...",
        "Experience true Sri Lankan hospitality in our comfortable rooms...",
        "Your home away from home, featuring modern amenities and local charm..."
    ],
    activities: [
        "Embark on thrilling adventures that will create lasting memories...",
        "Push your limits with our professionally guided outdoor experiences...",
        "From adrenaline-pumping activities to serene nature walks..."
    ],
    wellness: [
        "Rejuvenate your body and mind with authentic Ayurvedic treatments...",
        "Find your inner peace at our tranquil wellness retreat...",
        "Traditional healing practices combined with modern comfort..."
    ],
    dining: [
        "Savor the authentic flavors of Sri Lankan cuisine...",
        "From street food to fine dining, experience culinary excellence...",
        "Learn to cook traditional recipes from local experts..."
    ],
    wildlife: [
        "Encounter majestic elephants, leopards, and exotic birds...",
        "Explore Sri Lanka's incredible biodiversity with expert naturalists...",
        "Ethical wildlife experiences that support conservation..."
    ],
    water_sports: [
        "Dive into crystal-clear waters and discover underwater wonders...",
        "Ride the waves at world-renowned surf spots...",
        "Encounter whales and dolphins in their natural habitat..."
    ],
    cultural: [
        "Step back in time and explore ancient temples and ruins...",
        "Witness vibrant cultural performances and traditional crafts...",
        "Connect with local communities and their rich heritage..."
    ],
    transport: [
        "Travel in comfort with our professional chauffeur services...",
        "Reliable airport transfers and island-wide transportation...",
        "Explore at your own pace with our well-maintained vehicles..."
    ],
    photography: [
        "Capture stunning landscapes and wildlife with expert guidance...",
        "Professional photography services for your special moments...",
        "Drone photography showcasing Sri Lanka from above..."
    ]
};

const VendorRegistration = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiSuggestion, setAiSuggestion] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [files, setFiles] = useState<{
        idDocument?: File;
        businessRegistration?: File;
        photos: File[];
        profilePhoto?: File;
    }>({
        photos: []
    });

    const [formData, setFormData] = useState({
        // Step 2: Personal Info
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        whatsapp: '',

        // Step 3: Identity
        idType: 'nic',
        idNumber: '',

        // Step 4: Business
        businessName: '',
        businessType: 'individual',
        registrationNumber: '',
        yearsInBusiness: '',
        website: '',

        // Step 5: Service
        serviceName: '',
        serviceDescription: '',
        category: '',
        subCategories: [] as string[],
        locations: [] as string[],
        languages: ['English'],
        highlights: [] as string[],

        // Step 6: Pricing
        basePrice: '',
        currency: 'USD',
        priceType: 'per_person',
        groupDiscount: false,
        groupDiscountPercent: '',

        // Step 7: Availability
        availabilityType: 'daily',
        leadTime: '24',
        maxGroupSize: '',
        operatingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    });

    const { toast } = useToast();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleMultiSelect = (name: string, value: string) => {
        setFormData(prev => {
            const currentValues = prev[name as keyof typeof prev] as string[];
            if (currentValues.includes(value)) {
                return { ...prev, [name]: currentValues.filter(v => v !== value) };
            } else {
                return { ...prev, [name]: [...currentValues, value] };
            }
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'idDocument' | 'businessRegistration' | 'photos' | 'profilePhoto') => {
        if (e.target.files && e.target.files.length > 0) {
            if (type === 'photos') {
                const newPhotos = Array.from(e.target.files).slice(0, 10 - files.photos.length);
                setFiles(prev => ({ ...prev, photos: [...prev.photos, ...newPhotos] }));
            } else {
                setFiles(prev => ({ ...prev, [type]: e.target.files![0] }));
            }
        }
    };

    const removePhoto = (index: number) => {
        setFiles(prev => ({
            ...prev,
            photos: prev.photos.filter((_, i) => i !== index)
        }));
    };

    const generateAiDescription = async () => {
        setIsAiLoading(true);
        // Simulate AI generation with category-specific suggestions
        await new Promise(resolve => setTimeout(resolve, 1500));

        const category = formData.category || 'tours';
        const suggestions = aiSuggestions[category] || aiSuggestions.tours;
        const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];

        const fullSuggestion = `${randomSuggestion}

Our ${formData.serviceName || 'service'} offers:
• Professional and experienced guides
• Comfortable and safe transportation
• All entrance fees included
• Flexible scheduling to suit your needs
• Small group sizes for personalized attention

${formData.locations.length > 0 ? `Available in: ${formData.locations.join(', ')}` : ''}

Book with confidence - we're committed to providing unforgettable experiences in Sri Lanka!`;

        setAiSuggestion(fullSuggestion);
        setIsAiLoading(false);
    };

    const applyAiSuggestion = () => {
        setFormData(prev => ({ ...prev, serviceDescription: aiSuggestion }));
        setAiSuggestion('');
        toast({
            title: "AI Suggestion Applied",
            description: "Feel free to edit and personalize the description!",
        });
    };

    const nextStep = () => {
        if (currentStep < steps.length) {
            setCurrentStep(prev => prev + 1);
            window.scrollTo(0, 0);
        } else {
            handleSubmit();
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
            window.scrollTo(0, 0);
        }
    };

    const goToStep = (step: number) => {
        if (step <= currentStep) {
            setCurrentStep(step);
            window.scrollTo(0, 0);
        }
    };

    const uploadFile = async (file: File, path: string) => {
        if (!storage) throw new Error("Storage not initialized");
        const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
    };

    const handleSubmit = async () => {
        if (!agreedToTerms) {
            toast({
                title: "Terms Required",
                description: "Please agree to the terms and conditions to submit.",
                variant: "destructive"
            });
            return;
        }

        if (!db) {
            toast({
                title: "Error",
                description: "Database connection failed. Please try again later.",
                variant: "destructive"
            });
            return;
        }

        setIsSubmitting(true);
        try {
            // 1. Upload files
            let idDocumentUrl = '';
            let businessRegistrationUrl = '';
            let profilePhotoUrl = '';
            const photoUrls: string[] = [];

            if (files.profilePhoto) {
                profilePhotoUrl = await uploadFile(files.profilePhoto, 'vendor_profiles');
            }

            if (files.idDocument) {
                idDocumentUrl = await uploadFile(files.idDocument, 'vendor_docs/id');
            }

            if (files.businessRegistration) {
                businessRegistrationUrl = await uploadFile(files.businessRegistration, 'vendor_docs/business');
            }

            for (const photo of files.photos) {
                const url = await uploadFile(photo, 'vendor_photos');
                photoUrls.push(url);
            }

            // 2. Save to Firestore
            const vendorDoc = await addDoc(collection(db, 'vendors'), {
                ...formData,
                profilePhotoUrl,
                idDocumentUrl,
                businessRegistrationUrl,
                photoUrls,
                status: 'pending',
                rating: 0,
                reviewCount: 0,
                totalBookings: 0,
                isVerified: false,
                isFeatured: false,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            // 3. Try to send confirmation email (don't fail if email fails)
            try {
                const functions = getFunctions();
                const sendVendorEmail = httpsCallable(functions, 'sendEmail');
                await sendVendorEmail({
                    to: formData.email,
                    templateType: 'vendorApplicationSubmitted',
                    data: {
                        vendorName: `${formData.firstName} ${formData.lastName}`,
                        businessName: formData.businessName || formData.serviceName,
                        category: serviceCategories.find(c => c.id === formData.category)?.label || formData.category,
                        vendorId: vendorDoc.id
                    }
                });
            } catch (emailError) {
                console.warn('Email notification failed:', emailError);
            }

            toast({
                title: "Application Submitted! 🎉",
                description: "We'll review your application and get back to you within 24-48 hours.",
            });

            // Reset form and redirect
            setTimeout(() => {
                navigate('/vendor/dashboard');
            }, 2000);

        } catch (error) {
            console.error("Error submitting registration:", error);
            toast({
                title: "Submission Failed",
                description: "There was an error submitting your application. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        {/* Welcome Hero */}
                        <div className="text-center py-8">
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", duration: 0.6 }}
                                className="mx-auto mb-6"
                            >
                                <img
                                    src="/logo-v2.png"
                                    alt="Recharge Travels"
                                    className="h-20 w-auto mx-auto"
                                />
                            </motion.div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Become a Recharge Travels Partner
                            </h2>
                            <p className="text-gray-600 max-w-lg mx-auto mb-8">
                                Join Sri Lanka's premier travel platform and showcase your services to thousands of international tourists. Get bookings, grow your business, and earn more!
                            </p>
                        </div>

                        {/* Benefits Grid */}
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200">
                                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mb-3">
                                    <DollarSign className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1">Earn More</h3>
                                <p className="text-sm text-gray-600">Access international tourists and premium bookings</p>
                            </div>
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
                                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mb-3">
                                    <Zap className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1">Fast Payments</h3>
                                <p className="text-sm text-gray-600">Receive payments directly to your account</p>
                            </div>
                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border border-purple-200">
                                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mb-3">
                                    <Star className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1">Build Reputation</h3>
                                <p className="text-sm text-gray-600">Get reviews and become a verified partner</p>
                            </div>
                        </div>

                        {/* What You'll Need */}
                        <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                            <h3 className="font-semibold text-orange-900 mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                What you'll need to register:
                            </h3>
                            <ul className="grid md:grid-cols-2 gap-3 text-sm text-orange-800">
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-orange-600" />
                                    Valid ID (NIC or Passport)
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-orange-600" />
                                    Business registration (if applicable)
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-orange-600" />
                                    High-quality photos of your service
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-orange-600" />
                                    Pricing information
                                </li>
                            </ul>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        {/* Profile Photo Upload */}
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <div className="w-28 h-28 rounded-full bg-gray-100 border-4 border-white shadow-lg overflow-hidden">
                                    {files.profilePhoto ? (
                                        <img
                                            src={URL.createObjectURL(files.profilePhoto)}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <User className="w-12 h-12" />
                                        </div>
                                    )}
                                </div>
                                <label
                                    className="absolute bottom-0 right-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-600 transition-colors shadow-md"
                                    title="Upload profile photo"
                                >
                                    <Camera className="w-4 h-4 text-white" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleFileChange(e, 'profilePhoto')}
                                        aria-label="Upload profile photo"
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name *</Label>
                                <Input
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    placeholder="John"
                                    className="h-12"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name *</Label>
                                <Input
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    placeholder="Doe"
                                    className="h-12"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address *</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="john@example.com"
                                    className="h-12 pl-11"
                                />
                            </div>
                            <p className="text-xs text-gray-500">We'll send your login credentials here</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number *</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="+94 77 772 1999"
                                        className="h-12 pl-11"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="whatsapp" className="flex items-center gap-2">
                                    WhatsApp
                                    <Badge variant="secondary" className="text-xs">Recommended</Badge>
                                </Label>
                                <div className="relative">
                                    <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                                    <Input
                                        id="whatsapp"
                                        name="whatsapp"
                                        value={formData.whatsapp}
                                        onChange={handleInputChange}
                                        placeholder="+94 77 772 1999"
                                        className="h-12 pl-11"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                            <div className="flex items-start gap-3">
                                <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5" />
                                <div>
                                    <h4 className="font-medium text-blue-900">Identity Verification</h4>
                                    <p className="text-sm text-blue-700">Your ID helps us verify your identity and build trust with customers. Your documents are securely stored and never shared.</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>ID Document Type *</Label>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { id: 'nic', label: 'National ID (NIC)' },
                                    { id: 'passport', label: 'Passport' },
                                    { id: 'driving_license', label: 'Driving License' },
                                ].map((type) => (
                                    <button
                                        key={type.id}
                                        type="button"
                                        onClick={() => handleSelectChange('idType', type.id)}
                                        className={`p-4 rounded-xl border-2 text-center transition-all ${
                                            formData.idType === type.id
                                                ? 'border-orange-500 bg-orange-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <span className={`text-sm font-medium ${
                                            formData.idType === type.id ? 'text-orange-700' : 'text-gray-700'
                                        }`}>
                                            {type.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="idNumber">ID Number *</Label>
                            <Input
                                id="idNumber"
                                name="idNumber"
                                value={formData.idNumber}
                                onChange={handleInputChange}
                                placeholder="Enter your ID number"
                                className="h-12"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Upload ID Document *</Label>
                            <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                                files.idDocument ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-orange-300'
                            }`}>
                                {files.idDocument ? (
                                    <div className="flex items-center justify-center gap-3">
                                        <CheckCircle className="w-6 h-6 text-green-500" />
                                        <span className="text-green-700 font-medium">{files.idDocument.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => setFiles(prev => ({ ...prev, idDocument: undefined }))}
                                            className="text-red-500 hover:text-red-700"
                                            aria-label="Remove ID document"
                                            title="Remove ID document"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="cursor-pointer">
                                        <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                                        <p className="text-gray-600 font-medium">Click to upload or drag & drop</p>
                                        <p className="text-xs text-gray-500 mt-1">PDF, JPG, or PNG (max 5MB)</p>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={(e) => handleFileChange(e, 'idDocument')}
                                        />
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label>Business Type *</Label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { id: 'individual', label: 'Individual / Freelancer', icon: User },
                                    { id: 'company', label: 'Registered Business', icon: Building2 },
                                ].map((type) => {
                                    const Icon = type.icon;
                                    return (
                                        <button
                                            key={type.id}
                                            type="button"
                                            onClick={() => handleSelectChange('businessType', type.id)}
                                            className={`p-5 rounded-xl border-2 flex items-center gap-3 transition-all ${
                                                formData.businessType === type.id
                                                    ? 'border-orange-500 bg-orange-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                                formData.businessType === type.id ? 'bg-orange-500' : 'bg-gray-100'
                                            }`}>
                                                <Icon className={`w-5 h-5 ${
                                                    formData.businessType === type.id ? 'text-white' : 'text-gray-500'
                                                }`} />
                                            </div>
                                            <span className={`font-medium ${
                                                formData.businessType === type.id ? 'text-orange-700' : 'text-gray-700'
                                            }`}>
                                                {type.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="businessName">
                                {formData.businessType === 'company' ? 'Business Name *' : 'Trading Name (Optional)'}
                            </Label>
                            <Input
                                id="businessName"
                                name="businessName"
                                value={formData.businessName}
                                onChange={handleInputChange}
                                placeholder="e.g., Ceylon Adventures"
                                className="h-12"
                            />
                        </div>

                        {formData.businessType === 'company' && (
                            <div className="space-y-2">
                                <Label htmlFor="registrationNumber">Business Registration Number</Label>
                                <Input
                                    id="registrationNumber"
                                    name="registrationNumber"
                                    value={formData.registrationNumber}
                                    onChange={handleInputChange}
                                    placeholder="e.g., PV12345"
                                    className="h-12"
                                />
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="yearsInBusiness">Years in Business</Label>
                                <Select onValueChange={(value) => handleSelectChange('yearsInBusiness', value)} defaultValue={formData.yearsInBusiness}>
                                    <SelectTrigger className="h-12">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0-1">Less than 1 year</SelectItem>
                                        <SelectItem value="1-3">1-3 years</SelectItem>
                                        <SelectItem value="3-5">3-5 years</SelectItem>
                                        <SelectItem value="5-10">5-10 years</SelectItem>
                                        <SelectItem value="10+">10+ years</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="website">Website (Optional)</Label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        id="website"
                                        name="website"
                                        value={formData.website}
                                        onChange={handleInputChange}
                                        placeholder="www.yoursite.com"
                                        className="h-12 pl-11"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label>Service Category *</Label>
                            <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2">
                                {serviceCategories.map((cat) => {
                                    const Icon = cat.icon;
                                    return (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => handleSelectChange('category', cat.id)}
                                            className={`p-4 rounded-xl border-2 text-left transition-all ${
                                                formData.category === cat.id
                                                    ? 'border-orange-500 bg-orange-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center ${
                                                    formData.category === cat.id ? 'bg-orange-500' : 'bg-gray-100'
                                                }`}>
                                                    <Icon className={`w-5 h-5 ${
                                                        formData.category === cat.id ? 'text-white' : 'text-gray-500'
                                                    }`} />
                                                </div>
                                                <div>
                                                    <span className={`font-medium block ${
                                                        formData.category === cat.id ? 'text-orange-700' : 'text-gray-700'
                                                    }`}>
                                                        {cat.label}
                                                    </span>
                                                    <span className="text-xs text-gray-500">{cat.description}</span>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="serviceName">Service Name *</Label>
                            <Input
                                id="serviceName"
                                name="serviceName"
                                value={formData.serviceName}
                                onChange={handleInputChange}
                                placeholder="e.g., Sigiriya & Dambulla Day Tour"
                                className="h-12"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Service Locations *</Label>
                            <div className="flex flex-wrap gap-2 max-h-[150px] overflow-y-auto p-3 border rounded-xl bg-gray-50">
                                {sriLankaLocations.map((location) => (
                                    <button
                                        key={location}
                                        type="button"
                                        onClick={() => handleMultiSelect('locations', location)}
                                        className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                                            formData.locations.includes(location)
                                                ? 'bg-orange-500 text-white'
                                                : 'bg-white text-gray-700 border hover:border-orange-300'
                                        }`}
                                    >
                                        {location}
                                    </button>
                                ))}
                            </div>
                            {formData.locations.length > 0 && (
                                <p className="text-sm text-orange-600">{formData.locations.length} location(s) selected</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="serviceDescription">Service Description *</Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={generateAiDescription}
                                    disabled={isAiLoading || !formData.category}
                                    className="gap-2"
                                >
                                    {isAiLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Sparkles className="w-4 h-4 text-orange-500" />
                                    )}
                                    AI Assist
                                </Button>
                            </div>
                            <Textarea
                                id="serviceDescription"
                                name="serviceDescription"
                                value={formData.serviceDescription}
                                onChange={handleInputChange}
                                placeholder="Describe your service in detail. What makes it special? What's included?"
                                className="min-h-[150px]"
                            />

                            {/* AI Suggestion Box */}
                            <AnimatePresence>
                                {aiSuggestion && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-4"
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <Sparkles className="w-4 h-4 text-purple-500" />
                                            <span className="text-sm font-medium text-purple-700">AI Suggestion</span>
                                        </div>
                                        <p className="text-sm text-gray-700 whitespace-pre-line mb-3">{aiSuggestion}</p>
                                        <div className="flex gap-2">
                                            <Button size="sm" onClick={applyAiSuggestion} className="bg-purple-600 hover:bg-purple-700">
                                                Use This
                                            </Button>
                                            <Button size="sm" variant="ghost" onClick={() => setAiSuggestion('')}>
                                                Dismiss
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                );

            case 6:
                return (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label>Price Type *</Label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { id: 'per_person', label: 'Per Person' },
                                    { id: 'per_group', label: 'Per Group' },
                                    { id: 'per_night', label: 'Per Night' },
                                    { id: 'per_hour', label: 'Per Hour' },
                                ].map((type) => (
                                    <button
                                        key={type.id}
                                        type="button"
                                        onClick={() => handleSelectChange('priceType', type.id)}
                                        className={`p-4 rounded-xl border-2 transition-all ${
                                            formData.priceType === type.id
                                                ? 'border-orange-500 bg-orange-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <span className={`font-medium ${
                                            formData.priceType === type.id ? 'text-orange-700' : 'text-gray-700'
                                        }`}>
                                            {type.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="basePrice">Base Price *</Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        id="basePrice"
                                        name="basePrice"
                                        type="number"
                                        value={formData.basePrice}
                                        onChange={handleInputChange}
                                        placeholder="0.00"
                                        className="h-12 pl-11"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="currency">Currency *</Label>
                                <Select onValueChange={(value) => handleSelectChange('currency', value)} defaultValue={formData.currency}>
                                    <SelectTrigger className="h-12">
                                        <SelectValue placeholder="Select Currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="USD">USD ($)</SelectItem>
                                        <SelectItem value="EUR">EUR (€)</SelectItem>
                                        <SelectItem value="GBP">GBP (£)</SelectItem>
                                        <SelectItem value="LKR">LKR (Rs)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 border">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        id="groupDiscount"
                                        checked={formData.groupDiscount}
                                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, groupDiscount: !!checked }))}
                                    />
                                    <Label htmlFor="groupDiscount" className="cursor-pointer">
                                        Offer group discounts
                                    </Label>
                                </div>
                            </div>
                            {formData.groupDiscount && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="pt-3 border-t"
                                >
                                    <div className="flex items-center gap-3">
                                        <Input
                                            type="number"
                                            name="groupDiscountPercent"
                                            value={formData.groupDiscountPercent}
                                            onChange={handleInputChange}
                                            placeholder="10"
                                            className="w-24 h-10"
                                        />
                                        <span className="text-gray-600">% off for groups of 4+</span>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                            <h4 className="font-medium text-green-800 mb-2">💰 Earnings Calculator</h4>
                            <p className="text-sm text-green-700">
                                For a {formData.basePrice || '100'} {formData.currency} booking, you'll earn approximately{' '}
                                <strong>{(Number(formData.basePrice || 100) * 0.85).toFixed(2)} {formData.currency}</strong>{' '}
                                (after 15% platform fee)
                            </p>
                        </div>
                    </div>
                );

            case 7:
                return (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label>Availability Pattern *</Label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { id: 'daily', label: 'Available Daily' },
                                    { id: 'weekdays', label: 'Weekdays Only' },
                                    { id: 'weekends', label: 'Weekends Only' },
                                    { id: 'custom', label: 'Custom Schedule' },
                                ].map((type) => (
                                    <button
                                        key={type.id}
                                        type="button"
                                        onClick={() => handleSelectChange('availabilityType', type.id)}
                                        className={`p-4 rounded-xl border-2 transition-all ${
                                            formData.availabilityType === type.id
                                                ? 'border-orange-500 bg-orange-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <span className={`font-medium ${
                                            formData.availabilityType === type.id ? 'text-orange-700' : 'text-gray-700'
                                        }`}>
                                            {type.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="leadTime">Minimum Booking Notice</Label>
                                <Select onValueChange={(value) => handleSelectChange('leadTime', value)} defaultValue={formData.leadTime}>
                                    <SelectTrigger className="h-12">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">Same day booking OK</SelectItem>
                                        <SelectItem value="24">24 hours notice</SelectItem>
                                        <SelectItem value="48">48 hours notice</SelectItem>
                                        <SelectItem value="72">3 days notice</SelectItem>
                                        <SelectItem value="168">1 week notice</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="maxGroupSize">Maximum Group Size</Label>
                                <Input
                                    id="maxGroupSize"
                                    name="maxGroupSize"
                                    type="number"
                                    value={formData.maxGroupSize}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 10"
                                    className="h-12"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Languages Spoken</Label>
                            <div className="flex flex-wrap gap-2">
                                {['English', 'Sinhala', 'Tamil', 'German', 'French', 'Spanish', 'Italian', 'Japanese', 'Chinese', 'Russian'].map((lang) => (
                                    <button
                                        key={lang}
                                        type="button"
                                        onClick={() => handleMultiSelect('languages', lang)}
                                        className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                                            formData.languages.includes(lang)
                                                ? 'bg-orange-500 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {lang}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 8:
                return (
                    <div className="space-y-6">
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                            <div className="flex items-start gap-3">
                                <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                                <div>
                                    <h4 className="font-medium text-blue-900">Upload Supporting Documents</h4>
                                    <p className="text-sm text-blue-700">Documents help verify your business and increase customer trust.</p>
                                </div>
                            </div>
                        </div>

                        {formData.businessType === 'company' && (
                            <div className="space-y-2">
                                <Label>Business Registration Certificate</Label>
                                <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                                    files.businessRegistration ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-orange-300'
                                }`}>
                                    {files.businessRegistration ? (
                                        <div className="flex items-center justify-center gap-3">
                                            <CheckCircle className="w-6 h-6 text-green-500" />
                                            <span className="text-green-700 font-medium">{files.businessRegistration.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => setFiles(prev => ({ ...prev, businessRegistration: undefined }))}
                                                className="text-red-500 hover:text-red-700"
                                                aria-label="Remove business registration"
                                                title="Remove business registration"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer">
                                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                            <p className="text-gray-600 font-medium">Upload business certificate</p>
                                            <p className="text-xs text-gray-500 mt-1">PDF, JPG, or PNG (max 5MB)</p>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                onChange={(e) => handleFileChange(e, 'businessRegistration')}
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                            <h4 className="font-medium text-yellow-800 mb-2">📋 Optional Documents</h4>
                            <ul className="text-sm text-yellow-700 space-y-1">
                                <li>• Tourism Board License (SLTDA)</li>
                                <li>• Insurance Certificate</li>
                                <li>• Professional Certifications</li>
                                <li>• TripAdvisor / Google Reviews screenshot</li>
                            </ul>
                            <p className="text-xs text-yellow-600 mt-2">You can upload these later from your dashboard</p>
                        </div>
                    </div>
                );

            case 9:
                return (
                    <div className="space-y-6">
                        <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                            <div className="flex items-start gap-3">
                                <Camera className="w-5 h-5 text-orange-600 mt-0.5" />
                                <div>
                                    <h4 className="font-medium text-orange-900">Showcase Your Service</h4>
                                    <p className="text-sm text-orange-700">High-quality photos increase bookings by up to 80%. Upload 3-10 photos.</p>
                                </div>
                            </div>
                        </div>

                        <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                            files.photos.length > 0 ? 'border-orange-300 bg-orange-50' : 'border-gray-300 hover:border-orange-300'
                        }`}>
                            <label className="cursor-pointer">
                                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-600 font-medium">Click to upload photos</p>
                                <p className="text-xs text-gray-500 mt-1">JPG or PNG, max 5MB each. {10 - files.photos.length} slots remaining.</p>
                                <input
                                    type="file"
                                    className="hidden"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, 'photos')}
                                />
                            </label>
                        </div>

                        {files.photos.length > 0 && (
                            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                                {files.photos.map((file, index) => (
                                    <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`Photo ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removePhoto(index)}
                                            className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            aria-label={`Remove photo ${index + 1}`}
                                            title={`Remove photo ${index + 1}`}
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                        {index === 0 && (
                                            <div className="absolute bottom-0 left-0 right-0 bg-orange-500 text-white text-xs py-1 text-center">
                                                Cover Photo
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="bg-gray-50 rounded-xl p-4 border">
                            <h4 className="font-medium text-gray-800 mb-2">📸 Photo Tips</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>• Use natural lighting for best results</li>
                                <li>• Show people enjoying your service</li>
                                <li>• Include variety: locations, activities, facilities</li>
                                <li>• Avoid blurry or dark images</li>
                            </ul>
                        </div>
                    </div>
                );

            case 10:
                return (
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                                    <CheckCircle className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Almost There!</h3>
                                    <p className="text-sm text-gray-600">Review your information before submitting</p>
                                </div>
                            </div>

                            {/* Summary Cards */}
                            <div className="space-y-3">
                                <div className="bg-white rounded-lg p-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                        <User className="w-4 h-4" />
                                        Contact Information
                                    </div>
                                    <p className="font-medium">{formData.firstName} {formData.lastName}</p>
                                    <p className="text-sm text-gray-600">{formData.email}</p>
                                    <p className="text-sm text-gray-600">{formData.phone}</p>
                                </div>

                                <div className="bg-white rounded-lg p-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                        <Briefcase className="w-4 h-4" />
                                        Service Details
                                    </div>
                                    <p className="font-medium">{formData.serviceName || 'Not specified'}</p>
                                    <p className="text-sm text-gray-600">
                                        {serviceCategories.find(c => c.id === formData.category)?.label || formData.category}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {formData.locations.slice(0, 3).join(', ')}{formData.locations.length > 3 ? ` +${formData.locations.length - 3} more` : ''}
                                    </p>
                                </div>

                                <div className="bg-white rounded-lg p-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                        <DollarSign className="w-4 h-4" />
                                        Pricing
                                    </div>
                                    <p className="font-medium text-lg">{formData.basePrice} {formData.currency}</p>
                                    <p className="text-sm text-gray-600">{formData.priceType.replace('_', ' ')}</p>
                                </div>

                                <div className="bg-white rounded-lg p-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                        <ImageIcon className="w-4 h-4" />
                                        Uploads
                                    </div>
                                    <p className="text-sm">
                                        <span className={files.idDocument ? 'text-green-600' : 'text-red-500'}>
                                            {files.idDocument ? '✓' : '✗'} ID Document
                                        </span>
                                    </p>
                                    <p className="text-sm text-gray-600">{files.photos.length} photos uploaded</p>
                                </div>
                            </div>
                        </div>

                        {/* Terms Agreement */}
                        <div className="bg-gray-50 rounded-xl p-4 border">
                            <div className="flex items-start gap-3">
                                <Checkbox
                                    id="terms"
                                    checked={agreedToTerms}
                                    onCheckedChange={(checked) => setAgreedToTerms(!!checked)}
                                />
                                <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
                                    I agree to the{' '}
                                    <a href="/terms" className="text-orange-600 underline" target="_blank">
                                        Vendor Terms & Conditions
                                    </a>
                                    {' '}and{' '}
                                    <a href="/privacy" className="text-orange-600 underline" target="_blank">
                                        Privacy Policy
                                    </a>
                                    . I confirm that all information provided is accurate.
                                </label>
                            </div>
                        </div>

                        {/* What Happens Next */}
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                            <h4 className="font-medium text-blue-900 mb-3">What happens next?</h4>
                            <ul className="space-y-2 text-sm text-blue-800">
                                <li className="flex items-center gap-2">
                                    <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">1</span>
                                    We'll review your application within 24-48 hours
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">2</span>
                                    You'll receive a confirmation email with next steps
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">3</span>
                                    Once approved, your service goes live!
                                </li>
                            </ul>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    const progress = (currentStep / steps.length) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-gray-50">
            <Helmet>
                <title>Become a Partner - Recharge Travels Vendor Registration</title>
                <meta name="description" content="Join Recharge Travels as a vendor partner. Register your hotel, tour service, or activity and reach thousands of international tourists. Easy registration, fast payments!" />
                <meta name="keywords" content="sri lanka tourism partner, travel vendor registration, tour operator sign up, hotel registration sri lanka, become a vendor" />
            </Helmet>

            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <a href="/" className="flex items-center gap-2">
                            <img src="/logo-v2.png" alt="Recharge Travels" className="h-8 w-auto" />
                            <div className="hidden sm:flex flex-col">
                                <span className="text-sm font-semibold text-gray-900 leading-tight">Vendor Partner</span>
                                <span className="text-xs text-orange-600 leading-tight">Registration</span>
                            </div>
                        </a>
                        <div className="flex items-center gap-4">
                            <a
                                href="https://wa.me/94777721999"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700"
                            >
                                <MessageCircle className="w-4 h-4" />
                                <span className="hidden sm:inline">Need help?</span>
                            </a>
                            <a
                                href="/login"
                                className="text-sm text-gray-600 hover:text-orange-600"
                            >
                                Already registered? Login
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Sidebar - Steps */}
                    <div className="lg:col-span-3">
                        <Card className="sticky top-24">
                            <CardContent className="p-4">
                                <div className="mb-4">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600">Progress</span>
                                        <span className="font-medium text-orange-600">{Math.round(progress)}%</span>
                                    </div>
                                    <Progress value={progress} className="h-2" />
                                </div>
                                <nav className="space-y-1">
                                    {steps.map((step) => {
                                        const Icon = step.icon;
                                        const isActive = step.id === currentStep;
                                        const isCompleted = step.id < currentStep;
                                        const isClickable = step.id <= currentStep;

                                        return (
                                            <button
                                                key={step.id}
                                                onClick={() => isClickable && goToStep(step.id)}
                                                disabled={!isClickable}
                                                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
                                                    isActive
                                                        ? 'bg-orange-50 text-orange-700'
                                                        : isCompleted
                                                            ? 'text-gray-900 hover:bg-gray-50'
                                                            : 'text-gray-400 cursor-not-allowed'
                                                }`}
                                            >
                                                <div className={`flex-shrink-0 mr-3 w-8 h-8 flex items-center justify-center rounded-lg ${
                                                    isActive
                                                        ? 'bg-orange-500 text-white'
                                                        : isCompleted
                                                            ? 'bg-green-100 text-green-600'
                                                            : 'bg-gray-100 text-gray-400'
                                                }`}>
                                                    {isCompleted ? (
                                                        <CheckCircle className="w-4 h-4" />
                                                    ) : (
                                                        <Icon className="w-4 h-4" />
                                                    )}
                                                </div>
                                                <span className="truncate">{step.title}</span>
                                            </button>
                                        );
                                    })}
                                </nav>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Form Area */}
                    <div className="lg:col-span-9">
                        <Card className="shadow-xl border-0 overflow-hidden">
                            <div className="h-2 bg-gradient-to-r from-orange-500 via-orange-400 to-amber-400" />
                            <CardHeader className="pb-2">
                                <div className="flex items-center gap-3">
                                    {(() => {
                                        const StepIcon = steps[currentStep - 1].icon;
                                        return (
                                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                                <StepIcon className="w-6 h-6 text-orange-600" />
                                            </div>
                                        );
                                    })()}
                                    <div>
                                        <CardTitle className="text-xl">{steps[currentStep - 1].title}</CardTitle>
                                        <CardDescription>{steps[currentStep - 1].description}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-6 min-h-[450px]">
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
                            </CardContent>

                            <CardFooter className="bg-gray-50 px-6 py-4 flex justify-between">
                                <Button
                                    variant="outline"
                                    onClick={prevStep}
                                    disabled={currentStep === 1}
                                    className="gap-2"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Previous
                                </Button>

                                <Button
                                    onClick={nextStep}
                                    disabled={isSubmitting || (currentStep === steps.length && !agreedToTerms)}
                                    className="gap-2 bg-orange-500 hover:bg-orange-600"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : currentStep === steps.length ? (
                                        <>
                                            <Send className="w-4 h-4" />
                                            Submit Application
                                        </>
                                    ) : (
                                        <>
                                            Continue
                                            <ChevronRight className="w-4 h-4" />
                                        </>
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>

                        {/* Help Section */}
                        <div className="mt-6 text-center">
                            <p className="text-gray-600 text-sm">
                                Need help? Contact us at{' '}
                                <a href="mailto:info@rechargetravels.com" className="text-orange-600 hover:underline">
                                    info@rechargetravels.com
                                </a>
                                {' '}or{' '}
                                <a href="https://wa.me/94777721999" className="text-green-600 hover:underline inline-flex items-center gap-1">
                                    <MessageCircle className="w-4 h-4" />
                                    WhatsApp +94 77 772 1999
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorRegistration;
