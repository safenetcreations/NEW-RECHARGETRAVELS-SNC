import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Building2, MapPin, DollarSign, Image as ImageIcon, CheckCircle,
    Loader2, Upload, X, Home, User, Mail, Phone, ChevronRight,
    ChevronLeft, Star, Shield, Globe, Camera, MessageCircle, Sparkles,
    BadgeCheck, CreditCard, Building, FileText
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { propertyListingService, PropertyType } from '@/services/propertyListingService'

const PROPERTY_TYPES = [
    { value: 'vacation_home', label: 'Vacation Home', icon: Home },
    { value: 'apartment', label: 'Apartment', icon: Building2 },
    { value: 'villa', label: 'Villa', icon: Star },
    { value: 'luxury_resort', label: 'Luxury Resort', icon: Star },
    { value: 'boutique', label: 'Boutique Hotel', icon: Star },
    { value: 'guesthouse', label: 'Guesthouse', icon: Home },
    { value: 'cabana', label: 'Cabana', icon: Home },
    { value: 'eco_lodge', label: 'Eco Lodge', icon: Home },
    { value: 'budget', label: 'Budget Hotel', icon: Building2 },
    { value: 'business', label: 'Business Hotel', icon: Building2 }
]

const AMENITIES_LIST = [
    { id: 'WiFi', label: 'Free WiFi', icon: '📶' },
    { id: 'Pool', label: 'Swimming Pool', icon: '🏊‍♂️' },
    { id: 'Spa', label: 'Spa & Wellness', icon: '💆‍♀️' },
    { id: 'Restaurant', label: 'Restaurant', icon: '🍽️' },
    { id: 'Bar', label: 'Bar / Lounge', icon: '🍸' },
    { id: 'Gym', label: 'Fitness Center', icon: '💪' },
    { id: 'Room Service', label: 'Room Service', icon: '🛎️' },
    { id: 'Airport Shuttle', label: 'Airport Shuttle', icon: '🚐' },
    { id: 'Parking', label: 'Free Parking', icon: '🅿️' },
    { id: 'Air Conditioning', label: 'Air Conditioning', icon: '❄️' },
    { id: 'Beach Access', label: 'Beach Access', icon: '🏖️' },
    { id: 'Kitchen', label: 'Full Kitchen', icon: '🍳' },
    { id: 'Private Pool', label: 'Private Pool', icon: '🏊‍♂️' },
    { id: 'Washing Machine', label: 'Washing Machine', icon: '🧺' },
    { id: 'Balcony', label: 'Balcony / Terrace', icon: '🌅' },
    { id: 'BBQ Facilities', label: 'BBQ Facilities', icon: '🍖' },
    { id: 'Garden', label: 'Private Garden', icon: '🌳' },
    { id: 'Pet Friendly', label: 'Pet Friendly', icon: '🐾' }
]

const ListProperty = () => {
    const navigate = useNavigate()
    const { toast } = useToast()
    const [currentStep, setCurrentStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitSuccess, setSubmitSuccess] = useState(false)
    const [photos, setPhotos] = useState<File[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [formData, setFormData] = useState({
        ownerName: '',
        ownerEmail: '',
        ownerPhone: '',
        name: '',
        type: '',
        city: '',
        address: '',
        description: '',
        price: '',
        amenities: [] as string[]
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const toggleAmenity = (amenity: string) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity]
        }))
    }

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newPhotos = Array.from(e.target.files)
            setPhotos(prev => [...prev, ...newPhotos])
        }
    }

    const removePhoto = (index: number) => {
        setPhotos(prev => prev.filter((_, i) => i !== index))
    }

    const nextStep = () => {
        // Basic validation per step
        if (currentStep === 1 && (!formData.name || !formData.type || !formData.city)) {
            toast({ title: "Please fill in all required fields", variant: "destructive" })
            return
        }
        if (currentStep === 2 && (!formData.price || !formData.address)) {
            toast({ title: "Please fill in all required fields", variant: "destructive" })
            return
        }
        setCurrentStep(prev => prev + 1)
    }

    const prevStep = () => setCurrentStep(prev => prev - 1)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.ownerName || !formData.ownerEmail) {
            toast({ title: "Owner details are required", variant: "destructive" })
            return
        }

        setIsSubmitting(true)

        try {
            // Create the listing first to get an ID
            const listingId = await propertyListingService.createListing({
                name: formData.name,
                type: formData.type as PropertyType,
                description: formData.description,
                city: formData.city,
                address: formData.address,
                base_price_per_night: Number(formData.price),
                currency: 'USD',
                amenities: formData.amenities,
                images: [],
                owner_name: formData.ownerName,
                owner_email: formData.ownerEmail,
                owner_phone: formData.ownerPhone,
                is_featured: false,
                is_active: false,
                documents_verified: false,
                identity_verified: false,
                property_verified: false
            })

            // Upload images if any
            if (photos.length > 0) {
                const uploadedImages = await propertyListingService.uploadImages(listingId, photos)
                await propertyListingService.updateListing(listingId, { images: uploadedImages })
            }

            setSubmitSuccess(true)
            toast({
                title: "🎉 Application Submitted Successfully!",
                description: "Check your email for confirmation. We'll review your property within 24-48 hours.",
            })

        } catch (error) {
            console.error('Error listing property:', error)
            toast({
                title: "Submission Failed",
                description: "Please try again later.",
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    // Success Screen
    if (submitSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-lg w-full bg-white rounded-3xl shadow-2xl p-8 text-center"
                >
                    <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-4">Application Submitted!</h1>
                    <p className="text-slate-600 mb-6">
                        Thank you for your interest in partnering with Recharge Travels. We've sent a confirmation email to <span className="font-semibold text-teal-600">{formData.ownerEmail}</span>.
                    </p>
                    <div className="bg-teal-50 rounded-xl p-4 mb-6">
                        <h3 className="font-semibold text-teal-900 mb-2">What happens next?</h3>
                        <ul className="text-sm text-teal-700 space-y-2 text-left">
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                Our team will review your property within 24-48 hours
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                We may contact you for additional verification
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                Once approved, your property will be live on our platform
                            </li>
                        </ul>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button onClick={() => navigate('/')} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white">
                            Return to Homepage
                        </Button>
                        <Button onClick={() => { setSubmitSuccess(false); setCurrentStep(1) }} variant="outline" className="flex-1">
                            List Another Property
                        </Button>
                    </div>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Hero Section */}
            <div className="relative h-[45vh] min-h-[400px] bg-slate-900 overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80"
                        alt="Luxury Hotel"
                        className="w-full h-full object-cover opacity-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                </div>
                <div className="relative h-full container mx-auto px-4 flex flex-col justify-center items-center text-center text-white">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold mb-4 font-display"
                    >
                        Partner with Recharge Travels
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-slate-200 max-w-2xl"
                    >
                        Join Sri Lanka's premier luxury travel network. List your property and reach high-value travelers from around the globe.
                    </motion.p>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Benefits */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100">
                            <h3 className="text-lg font-semibold mb-4 text-slate-900">Why Partner With Us?</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-teal-50 rounded-lg text-teal-600">
                                        <Globe className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-slate-900">Global Reach</h4>
                                        <p className="text-sm text-slate-500">Access our network of international luxury travelers.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                                        <Shield className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-slate-900">Verified Guests</h4>
                                        <p className="text-sm text-slate-500">We screen guests to ensure quality and safety.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                                        <Star className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-slate-900">Premium Branding</h4>
                                        <p className="text-sm text-slate-500">Showcase your property alongside the best in Sri Lanka.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-teal-600 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
                            <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
                            <p className="text-teal-100 text-sm mb-4">Our partner support team is here to assist you with the onboarding process.</p>
                            <div className="space-y-3">
                                <a href="tel:+94777721999" className="flex items-center gap-2 text-sm font-medium hover:text-teal-100 transition-colors">
                                    <Phone className="h-4 w-4" />
                                    +94 77 772 1999
                                </a>
                                <a href="https://wa.me/94777721999" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium hover:text-teal-100 transition-colors">
                                    <MessageCircle className="h-4 w-4" />
                                    Chat on WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Multi-step Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                            {/* Progress Bar */}
                            <div className="bg-slate-50 px-8 py-4 border-b border-slate-100">
                                <div className="flex items-center justify-between text-sm font-medium text-slate-500 mb-2">
                                    <span>Step {currentStep} of 4</span>
                                    <span>{Math.round((currentStep / 4) * 100)}% Completed</span>
                                </div>
                                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-teal-600"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(currentStep / 4) * 100}%` }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8">
                                <AnimatePresence mode="wait">

                                    {/* Step 1: Basic Info */}
                                    {currentStep === 1 && (
                                        <motion.div
                                            key="step1"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-6"
                                        >
                                            <div className="text-center mb-8">
                                                <h2 className="text-2xl font-bold text-slate-900">Tell us about your property</h2>
                                                <p className="text-slate-500 mt-2 max-w-md mx-auto">Start by giving your property a name, choosing its type, and setting its location. This helps guests find you easily.</p>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name">Property Name</Label>
                                                    <Input
                                                        id="name" name="name"
                                                        value={formData.name} onChange={handleInputChange}
                                                        placeholder="e.g. The Ocean Villa"
                                                        className="h-12 text-lg"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <Label>Property Type</Label>
                                                        <Select value={formData.type} onValueChange={(val) => handleSelectChange('type', val)}>
                                                            <SelectTrigger className="h-12">
                                                                <SelectValue placeholder="Select type" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {PROPERTY_TYPES.map(type => (
                                                                    <SelectItem key={type.value} value={type.value}>
                                                                        <div className="flex items-center gap-2">
                                                                            <type.icon className="h-4 w-4 text-slate-400" />
                                                                            {type.label}
                                                                        </div>
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="city">City / Location</Label>
                                                        <Input
                                                            id="city" name="city"
                                                            value={formData.city} onChange={handleInputChange}
                                                            placeholder="e.g. Galle Fort"
                                                            className="h-12"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Step 2: Details */}
                                    {currentStep === 2 && (
                                        <motion.div
                                            key="step2"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-6"
                                        >
                                            <div className="text-center mb-8">
                                                <h2 className="text-2xl font-bold text-slate-900">Property Details</h2>
                                                <p className="text-slate-500 mt-2 max-w-md mx-auto">Describe what makes your place special. Add a detailed description, set your price, and highlight key amenities.</p>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="description">Description</Label>
                                                    <Textarea
                                                        id="description" name="description"
                                                        value={formData.description} onChange={handleInputChange}
                                                        placeholder="Describe the unique features, views, and atmosphere..."
                                                        className="min-h-[150px] text-base resize-none"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="price">Base Price per Night (USD)</Label>
                                                        <div className="relative">
                                                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                                            <Input
                                                                id="price" name="price" type="number"
                                                                value={formData.price} onChange={handleInputChange}
                                                                className="pl-10 h-12 text-lg font-medium"
                                                                placeholder="250"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="address">Full Address</Label>
                                                        <Input
                                                            id="address" name="address"
                                                            value={formData.address} onChange={handleInputChange}
                                                            placeholder="Street address, postal code"
                                                            className="h-12"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <Label>Key Amenities</Label>
                                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                        {AMENITIES_LIST.map(amenity => (
                                                            <div
                                                                key={amenity.id}
                                                                onClick={() => toggleAmenity(amenity.id)}
                                                                className={`
                                  cursor-pointer p-3 rounded-xl border flex items-center gap-3 transition-all duration-200
                                  ${formData.amenities.includes(amenity.id)
                                                                        ? 'bg-teal-50 border-teal-200 ring-1 ring-teal-500'
                                                                        : 'bg-white border-slate-200 hover:border-teal-200 hover:bg-slate-50'}
                                `}
                                                            >
                                                                <span className="text-xl">{amenity.icon}</span>
                                                                <span className={`text-sm font-medium ${formData.amenities.includes(amenity.id) ? 'text-teal-900' : 'text-slate-600'}`}>
                                                                    {amenity.label}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Step 3: Photos */}
                                    {currentStep === 3 && (
                                        <motion.div
                                            key="step3"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-6"
                                        >
                                            <div className="text-center mb-8">
                                                <h2 className="text-2xl font-bold text-slate-900">Visual Gallery</h2>
                                                <p className="text-slate-500 mt-2 max-w-md mx-auto">Upload high-quality photos to showcase your property. Bright, clear images attract more bookings.</p>
                                            </div>

                                            <div className="space-y-6">
                                                <div
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="border-2 border-dashed border-slate-300 rounded-2xl p-10 text-center cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition-all group"
                                                >
                                                    <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                                        <Upload className="h-8 w-8" />
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-slate-900">Click to upload photos</h3>
                                                    <p className="text-slate-500 mt-1">or drag and drop high-quality images here</p>
                                                    <input
                                                        type="file"
                                                        ref={fileInputRef}
                                                        multiple
                                                        accept="image/*"
                                                        onChange={handlePhotoChange}
                                                        className="hidden"
                                                    />
                                                </div>

                                                {photos.length > 0 && (
                                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                        {photos.map((photo, index) => (
                                                            <div key={index} className="relative aspect-[4/3] rounded-xl overflow-hidden group shadow-sm">
                                                                <img src={URL.createObjectURL(photo)} alt="Preview" className="w-full h-full object-cover" />
                                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => { e.stopPropagation(); removePhoto(index); }}
                                                                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                                                    >
                                                                        <X className="h-4 w-4" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Step 4: Owner Info */}
                                    {currentStep === 4 && (
                                        <motion.div
                                            key="step4"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-6"
                                        >
                                            <div className="text-center mb-8">
                                                <h2 className="text-2xl font-bold text-slate-900">Final Step</h2>
                                                <p className="text-slate-500 mt-2 max-w-md mx-auto">Provide your contact details so we can reach you regarding your listing and bookings.</p>
                                            </div>

                                            <div className="space-y-4 max-w-md mx-auto">
                                                <div className="space-y-2">
                                                    <Label htmlFor="ownerName">Full Name</Label>
                                                    <div className="relative">
                                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                                        <Input
                                                            id="ownerName" name="ownerName"
                                                            value={formData.ownerName} onChange={handleInputChange}
                                                            className="pl-10 h-12"
                                                            placeholder="John Doe"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="ownerEmail">Email Address</Label>
                                                    <div className="relative">
                                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                                        <Input
                                                            id="ownerEmail" name="ownerEmail" type="email"
                                                            value={formData.ownerEmail} onChange={handleInputChange}
                                                            className="pl-10 h-12"
                                                            placeholder="john@example.com"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="ownerPhone">Phone Number</Label>
                                                    <div className="relative">
                                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                                        <Input
                                                            id="ownerPhone" name="ownerPhone"
                                                            value={formData.ownerPhone} onChange={handleInputChange}
                                                            className="pl-10 h-12"
                                                            placeholder="+94 77 123 4567"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                </AnimatePresence>

                                {/* Navigation Buttons */}
                                <div className="mt-10 flex justify-between pt-6 border-t border-slate-100">
                                    {currentStep > 1 ? (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={prevStep}
                                            className="h-12 px-6"
                                        >
                                            <ChevronLeft className="mr-2 h-4 w-4" /> Back
                                        </Button>
                                    ) : (
                                        <div /> // Spacer
                                    )}

                                    {currentStep < 4 ? (
                                        <Button
                                            type="button"
                                            onClick={nextStep}
                                            className="h-12 px-8 bg-teal-600 hover:bg-teal-700 text-white"
                                        >
                                            Next Step <ChevronRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    ) : (
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="h-12 px-8 bg-teal-600 hover:bg-teal-700 text-white min-w-[160px]"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                'Submit Application'
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ListProperty
