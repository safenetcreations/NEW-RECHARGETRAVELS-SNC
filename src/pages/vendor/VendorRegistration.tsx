import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
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
    ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';

// Steps definition
const steps = [
    { id: 1, title: 'Basic Info', icon: User },
    { id: 2, title: 'Identity', icon: ShieldCheck },
    { id: 3, title: 'Business', icon: Building2 },
    { id: 4, title: 'Service', icon: Briefcase },
    { id: 5, title: 'Pricing', icon: DollarSign },
    { id: 6, title: 'Availability', icon: Calendar },
    { id: 7, title: 'Docs', icon: FileText },
    { id: 8, title: 'Photos', icon: ImageIcon },
    { id: 9, title: 'Review', icon: CheckCircle },
];

const VendorRegistration = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        // Step 1: Basic Info
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        whatsapp: '',

        // Step 2: Identity
        idType: 'passport',
        idNumber: '',

        // Step 3: Business
        businessName: '',
        businessType: 'tour_operator',
        registrationNumber: '',

        // Step 4: Service
        serviceName: '',
        serviceDescription: '',
        category: 'tours',
        location: '',

        // Step 5: Pricing
        basePrice: '',
        currency: 'USD',

        // Step 6: Availability
        availabilityType: 'daily',

        // Step 7 & 8 are file uploads (handled separately in real impl)
    });

    const { toast } = useToast();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
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

    const handleSubmit = () => {
        // In a real implementation, this would send data to Firebase
        console.log('Submitting form data:', formData);
        toast({
            title: "Registration Submitted!",
            description: "Your vendor application has been received. We will review it shortly.",
        });
        // Redirect or show success state
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="John" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Doe" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="john@example.com" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+94 77 123 4567" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="whatsapp">WhatsApp Number</Label>
                                <Input id="whatsapp" name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} placeholder="+94 77 123 4567" />
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="idType">ID Document Type</Label>
                            <Select onValueChange={(value) => handleSelectChange('idType', value)} defaultValue={formData.idType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select ID Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="passport">Passport</SelectItem>
                                    <SelectItem value="nic">National ID (NIC)</SelectItem>
                                    <SelectItem value="driving_license">Driving License</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="idNumber">ID Number</Label>
                            <Input id="idNumber" name="idNumber" value={formData.idNumber} onChange={handleInputChange} placeholder="Enter ID Number" />
                        </div>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                <ImageIcon className="w-6 h-6 text-blue-600" />
                            </div>
                            <p className="text-sm font-medium text-gray-900">Upload ID Document</p>
                            <p className="text-xs text-gray-500 mt-1">Drag and drop or click to upload</p>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="businessName">Business Name</Label>
                            <Input id="businessName" name="businessName" value={formData.businessName} onChange={handleInputChange} placeholder="Recharge Tours & Travels" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="businessType">Business Type</Label>
                            <Select onValueChange={(value) => handleSelectChange('businessType', value)} defaultValue={formData.businessType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Business Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="tour_operator">Tour Operator</SelectItem>
                                    <SelectItem value="hotel">Hotel / Guesthouse</SelectItem>
                                    <SelectItem value="guide">Tour Guide</SelectItem>
                                    <SelectItem value="restaurant">Restaurant</SelectItem>
                                    <SelectItem value="activity">Activity Provider</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="registrationNumber">Business Registration Number (Optional)</Label>
                            <Input id="registrationNumber" name="registrationNumber" value={formData.registrationNumber} onChange={handleInputChange} placeholder="BR-12345" />
                        </div>
                    </div>
                );
            // ... Add other steps similarly
            default:
                return (
                    <div className="text-center py-8">
                        <h3 className="text-lg font-medium">Step {currentStep} Content Placeholder</h3>
                        <p className="text-gray-500">This step is under construction.</p>
                    </div>
                );
        }
    };

    const progress = (currentStep / steps.length) * 100;

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <Helmet>
                <title>Vendor Registration - Recharge Travels Partner Program</title>
                <meta name="description" content="Join Recharge Travels as a vendor. Register your hotel, tour service, or activity and reach international tourists. Fast payments and easy management." />
                <meta name="keywords" content="sri lanka tourism partner, travel vendor registration, tour operator sign up, hotel registration sri lanka" />
            </Helmet>
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendor Registration</h1>
                    <p className="text-gray-600">Join Recharge Travels and grow your business with international tourists</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Sidebar Steps */}
                    <div className="md:col-span-4 lg:col-span-3">
                        <Card>
                            <CardContent className="p-4">
                                <nav className="space-y-1">
                                    {steps.map((step) => {
                                        const Icon = step.icon;
                                        const isActive = step.id === currentStep;
                                        const isCompleted = step.id < currentStep;

                                        return (
                                            <div
                                                key={step.id}
                                                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive
                                                    ? 'bg-blue-50 text-blue-700'
                                                    : isCompleted
                                                        ? 'text-gray-900'
                                                        : 'text-gray-500'
                                                    }`}
                                            >
                                                <div className={`flex-shrink-0 mr-3 w-8 h-8 flex items-center justify-center rounded-full border-2 ${isActive
                                                    ? 'border-blue-600 bg-white'
                                                    : isCompleted
                                                        ? 'border-green-500 bg-green-50'
                                                        : 'border-gray-200'
                                                    }`}>
                                                    {isCompleted ? (
                                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                                    ) : (
                                                        <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                                                    )}
                                                </div>
                                                <span className="truncate">{step.title}</span>
                                            </div>
                                        );
                                    })}
                                </nav>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Form Area */}
                    <div className="md:col-span-8 lg:col-span-9">
                        <Card className="shadow-lg border-t-4 border-t-blue-600">
                            <CardHeader>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-500">Step {currentStep} of {steps.length}</span>
                                    <span className="text-sm font-medium text-blue-600">{Math.round(progress)}% Completed</span>
                                </div>
                                <Progress value={progress} className="h-2" />
                                <CardTitle className="mt-6 text-2xl">{steps[currentStep - 1].title}</CardTitle>
                                <CardDescription>Please provide the required information below.</CardDescription>
                            </CardHeader>

                            <CardContent className="min-h-[400px]">
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

                            <CardFooter className="flex justify-between bg-gray-50 p-6 rounded-b-xl">
                                <Button
                                    variant="outline"
                                    onClick={prevStep}
                                    disabled={currentStep === 1}
                                    className="w-32"
                                >
                                    <ChevronLeft className="w-4 h-4 mr-2" />
                                    Previous
                                </Button>

                                <Button
                                    onClick={nextStep}
                                    className="w-32 bg-blue-600 hover:bg-blue-700"
                                >
                                    {currentStep === steps.length ? 'Submit' : 'Next'}
                                    {currentStep !== steps.length && <ChevronRight className="w-4 h-4 ml-2" />}
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorRegistration;
