import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Building2, MapPin, DollarSign, Image as ImageIcon, CheckCircle, Loader2, Upload, X, Home, User, Mail, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { firebaseHotelService } from '@/services/firebaseHotelService'
import { storage } from '@/lib/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

const PROPERTY_TYPES = [
    { value: 'vacation_home', label: 'Vacation Home' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'villa', label: 'Villa' },
    { value: 'luxury_resort', label: 'Luxury Resort' },
    { value: 'boutique', label: 'Boutique Hotel' },
    { value: 'guesthouse', label: 'Guesthouse' },
    { value: 'cabana', label: 'Cabana' },
    { value: 'eco_lodge', label: 'Eco Lodge' },
    { value: 'budget', label: 'Budget Hotel' },
    { value: 'business', label: 'Business Hotel' }
]

const AMENITIES_LIST = [
    'WiFi', 'Pool', 'Spa', 'Restaurant', 'Bar', 'Gym', 'Room Service',
    'Airport Shuttle', 'Parking', 'Air Conditioning', 'Beach Access',
    'Kitchen', 'Private Pool', 'Washing Machine', 'Balcony', 'Terrace',
    'BBQ Facilities', 'Garden', 'Pet Friendly'
]

const ListProperty = () => {
    const navigate = useNavigate()
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [photos, setPhotos] = useState<File[]>([])

    const [formData, setFormData] = useState({
        // Owner Info
        ownerName: '',
        ownerEmail: '',
        ownerPhone: '',

        // Property Info
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.name || !formData.type || !formData.city || !formData.price || !formData.ownerName || !formData.ownerEmail) {
            toast({
                title: "Missing Information",
                description: "Please fill in all required fields.",
                variant: "destructive"
            })
            return
        }

        setIsSubmitting(true)

        try {
            // 1. Upload Photos
            const uploadedImages = []
            for (let i = 0; i < photos.length; i++) {
                const file = photos[i]
                const storageRef = ref(storage, `hotel_images/${Date.now()}_${file.name}`)
                await uploadBytes(storageRef, file)
                const url = await getDownloadURL(storageRef)
                uploadedImages.push({
                    id: `img_${Date.now()}_${i}`,
                    hotel_id: '', // Will be set after creation or ignored
                    image_url: url,
                    is_primary: i === 0,
                    sort_order: i
                })
            }

            // 2. Create Hotel Document
            await firebaseHotelService.createHotel({
                name: formData.name,
                description: formData.description,
                hotel_type: formData.type as any,
                city: { id: 'custom', name: formData.city, country: 'Sri Lanka' }, // Simplified city handling
                address: formData.address,
                base_price_per_night: Number(formData.price),
                amenities: formData.amenities,
                images: uploadedImages,
                is_active: false, // Pending approval
                hostProfile: {
                    name: formData.ownerName,
                    joinedDate: new Date().toISOString(),
                    isVerified: false
                },
                email: formData.ownerEmail,
                phone: formData.ownerPhone,
                country: 'Sri Lanka'
            })

            toast({
                title: "Property Listed Successfully!",
                description: "Your property has been submitted for review. We will contact you shortly.",
            })

            // Redirect to home or success page
            setTimeout(() => {
                navigate('/')
            }, 2000)

        } catch (error) {
            console.error('Error listing property:', error)
            toast({
                title: "Submission Failed",
                description: "There was an error submitting your property. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900">List Your Property</h1>
                    <p className="mt-2 text-gray-600">Join our network of premium accommodations in Sri Lanka</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-2xl shadow-sm">

                    {/* Owner Details */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <User className="h-5 w-5 text-teal-600" />
                            Owner Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="ownerName">Full Name *</Label>
                                <Input id="ownerName" name="ownerName" value={formData.ownerName} onChange={handleInputChange} placeholder="John Doe" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ownerPhone">Phone Number</Label>
                                <Input id="ownerPhone" name="ownerPhone" value={formData.ownerPhone} onChange={handleInputChange} placeholder="+94 77 123 4567" />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="ownerEmail">Email Address *</Label>
                                <Input id="ownerEmail" name="ownerEmail" type="email" value={formData.ownerEmail} onChange={handleInputChange} placeholder="john@example.com" required />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100" />

                    {/* Property Details */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Home className="h-5 w-5 text-teal-600" />
                            Property Details
                        </h2>

                        <div className="space-y-2">
                            <Label htmlFor="name">Property Name *</Label>
                            <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Sunset Villa" required />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="type">Property Type *</Label>
                                <Select onValueChange={(val) => handleSelectChange('type', val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PROPERTY_TYPES.map(type => (
                                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="price">Price per Night (USD) *</Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input id="price" name="price" type="number" value={formData.price} onChange={handleInputChange} className="pl-9" placeholder="100" required />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="city">City *</Label>
                                <Input id="city" name="city" value={formData.city} onChange={handleInputChange} placeholder="e.g. Galle" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input id="address" name="address" value={formData.address} onChange={handleInputChange} placeholder="Full address" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="Describe your property..." rows={4} />
                        </div>
                    </div>

                    <div className="border-t border-gray-100" />

                    {/* Amenities */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-teal-600" />
                            Amenities
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {AMENITIES_LIST.map(amenity => (
                                <div key={amenity} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id={`amenity-${amenity}`}
                                        checked={formData.amenities.includes(amenity)}
                                        onChange={() => toggleAmenity(amenity)}
                                        className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                                    />
                                    <label htmlFor={`amenity-${amenity}`} className="text-sm text-gray-700 cursor-pointer select-none">
                                        {amenity}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-gray-100" />

                    {/* Photos */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <ImageIcon className="h-5 w-5 text-teal-600" />
                            Photos
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {photos.map((photo, index) => (
                                <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                                    <img src={URL.createObjectURL(photo)} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removePhoto(index)}
                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}

                            <label className="border-2 border-dashed border-gray-300 rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition-colors">
                                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                <span className="text-sm text-gray-500">Upload Photos</span>
                                <input type="file" multiple accept="image/*" onChange={handlePhotoChange} className="hidden" />
                            </label>
                        </div>
                    </div>

                    <div className="pt-6">
                        <Button type="submit" className="w-full h-12 text-lg bg-teal-600 hover:bg-teal-700" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                'Submit Property'
                            )}
                        </Button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default ListProperty
