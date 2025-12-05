import React, { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Building2, MapPin, DollarSign, Image as ImageIcon, CheckCircle, Check,
  Loader2, Upload, X, Home, User, Mail, Phone, ChevronRight, ChevronDown,
  ChevronLeft, Star, Shield, Globe, Camera, MessageCircle, Sparkles,
  BadgeCheck, CreditCard, Building, FileText, Bed, Users, Clock, Calendar,
  Wifi, Car, UtensilsCrossed, Waves, TreePine, Mountain, Dumbbell, Coffee,
  Tv, Wind, Bath, Refrigerator, Shirt, Lock, Info, AlertCircle, Plus, Minus,
  Trash2, GripVertical, Eye, Save, Send, HelpCircle, ArrowRight, Banknote,
  FileCheck, Languages, MapPinned, Palmtree, Hotel, Castle, Tent, TreeDeciduous,
  Warehouse, Landmark
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import {
  propertyListingService,
  PropertyType,
  PropertyListing,
  RoomConfiguration,
  PropertyImage,
  PropertyPolicies,
  PricingConfig,
  LocationDetails,
  OwnerDetails,
  BankDetails,
  RoomType,
  BedType,
  CancellationPolicy,
  MealPlan
} from '@/services/propertyListingService'

// Property Types with icons and descriptions
const PROPERTY_TYPES: {
  category: string
  types: { value: PropertyType; label: string; icon: React.ElementType; description: string }[]
}[] = [
    {
      category: 'Hotels & Resorts',
      types: [
        { value: 'hotel', label: 'Hotel', icon: Hotel, description: 'Traditional hotel with multiple rooms and amenities' },
        { value: 'resort', label: 'Resort', icon: Palmtree, description: 'Full-service resort with recreational facilities' },
        { value: 'boutique_hotel', label: 'Boutique Hotel', icon: Castle, description: 'Unique, stylish hotel with personalized service' },
        { value: 'business_hotel', label: 'Business Hotel', icon: Building2, description: 'Hotel catering to business travelers' }
      ]
    },
    {
      category: 'Homes & Apartments',
      types: [
        { value: 'villa', label: 'Villa', icon: Home, description: 'Luxury standalone property with private amenities' },
        { value: 'vacation_home', label: 'Vacation Home', icon: Home, description: 'Fully furnished home for holiday stays' },
        { value: 'apartment', label: 'Apartment', icon: Building, description: 'Self-contained unit in a building' },
        { value: 'condo', label: 'Condominium', icon: Building2, description: 'Privately owned unit in a complex' }
      ]
    },
    {
      category: 'Unique Stays',
      types: [
        { value: 'eco_lodge', label: 'Eco Lodge', icon: TreeDeciduous, description: 'Environmentally sustainable accommodation' },
        { value: 'treehouse', label: 'Treehouse', icon: TreePine, description: 'Elevated accommodation in nature' },
        { value: 'glamping', label: 'Glamping', icon: Tent, description: 'Luxury camping experience' },
        { value: 'cabin', label: 'Cabin', icon: Warehouse, description: 'Rustic wooden accommodation' }
      ]
    },
    {
      category: 'Guesthouses & B&Bs',
      types: [
        { value: 'guesthouse', label: 'Guesthouse', icon: Home, description: 'Small establishment offering accommodation' },
        { value: 'bed_and_breakfast', label: 'Bed & Breakfast', icon: Coffee, description: 'Accommodation with breakfast included' },
        { value: 'hostel', label: 'Hostel', icon: Users, description: 'Budget-friendly shared accommodation' },
        { value: 'homestay', label: 'Homestay', icon: Home, description: 'Stay with a local family' }
      ]
    },
    {
      category: 'Beach & Nature',
      types: [
        { value: 'beach_house', label: 'Beach House', icon: Waves, description: 'Property near or on the beach' },
        { value: 'bungalow', label: 'Bungalow', icon: Home, description: 'Single-story detached house' },
        { value: 'chalet', label: 'Chalet', icon: Mountain, description: 'Wooden house in mountain style' },
        { value: 'cottage', label: 'Cottage', icon: Home, description: 'Small, cozy country house' }
      ]
    }
  ]

// Comprehensive amenities list organized by category
const AMENITIES_BY_CATEGORY = {
  'Popular': [
    { id: 'wifi', label: 'Free WiFi', icon: Wifi },
    { id: 'parking', label: 'Free Parking', icon: Car },
    { id: 'pool', label: 'Swimming Pool', icon: Waves },
    { id: 'air_conditioning', label: 'Air Conditioning', icon: Wind },
    { id: 'breakfast', label: 'Breakfast Included', icon: Coffee },
    { id: 'gym', label: 'Fitness Center', icon: Dumbbell }
  ],
  'Room Amenities': [
    { id: 'tv', label: 'Flat Screen TV', icon: Tv },
    { id: 'minibar', label: 'Minibar', icon: Refrigerator },
    { id: 'safe', label: 'In-room Safe', icon: Lock },
    { id: 'balcony', label: 'Balcony/Terrace', icon: Mountain },
    { id: 'bathtub', label: 'Bathtub', icon: Bath },
    { id: 'hairdryer', label: 'Hairdryer', icon: Wind }
  ],
  'Services': [
    { id: 'room_service', label: '24/7 Room Service', icon: UtensilsCrossed },
    { id: 'concierge', label: 'Concierge', icon: User },
    { id: 'laundry', label: 'Laundry Service', icon: Shirt },
    { id: 'airport_shuttle', label: 'Airport Shuttle', icon: Car },
    { id: 'tour_desk', label: 'Tour Desk', icon: MapPin },
    { id: 'luggage_storage', label: 'Luggage Storage', icon: Lock }
  ],
  'Facilities': [
    { id: 'restaurant', label: 'Restaurant', icon: UtensilsCrossed },
    { id: 'bar', label: 'Bar/Lounge', icon: Coffee },
    { id: 'spa', label: 'Spa & Wellness', icon: Sparkles },
    { id: 'garden', label: 'Garden', icon: TreePine },
    { id: 'beach_access', label: 'Beach Access', icon: Waves },
    { id: 'kids_club', label: 'Kids Club', icon: Users }
  ]
}

// Room types
const ROOM_TYPES: { value: RoomType; label: string }[] = [
  { value: 'standard', label: 'Standard Room' },
  { value: 'deluxe', label: 'Deluxe Room' },
  { value: 'suite', label: 'Suite' },
  { value: 'family', label: 'Family Room' },
  { value: 'presidential', label: 'Presidential Suite' },
  { value: 'penthouse', label: 'Penthouse' },
  { value: 'studio', label: 'Studio' },
  { value: 'dormitory', label: 'Dormitory' }
]

// Bed types
const BED_TYPES: { value: BedType; label: string }[] = [
  { value: 'single', label: 'Single Bed' },
  { value: 'double', label: 'Double Bed' },
  { value: 'queen', label: 'Queen Bed' },
  { value: 'king', label: 'King Bed' },
  { value: 'twin', label: 'Twin Beds' },
  { value: 'bunk', label: 'Bunk Bed' },
  { value: 'sofa_bed', label: 'Sofa Bed' }
]

// Sri Lankan cities
const SRI_LANKAN_CITIES = [
  'Colombo', 'Kandy', 'Galle', 'Negombo', 'Sigiriya', 'Ella', 'Nuwara Eliya',
  'Trincomalee', 'Bentota', 'Hikkaduwa', 'Mirissa', 'Unawatuna', 'Arugam Bay',
  'Anuradhapura', 'Polonnaruwa', 'Dambulla', 'Jaffna', 'Batticaloa', 'Tangalle',
  'Weligama', 'Matara', 'Habarana', 'Yala', 'Wilpattu', 'Kitulgala', 'Ratnapura'
]

// Languages
const LANGUAGES = [
  'English', 'Sinhala', 'Tamil', 'German', 'French', 'Italian', 'Spanish',
  'Chinese', 'Japanese', 'Korean', 'Russian', 'Arabic', 'Hindi', 'Dutch'
]

// Steps configuration
const STEPS = [
  { id: 1, title: 'Property Type', icon: Building2 },
  { id: 2, title: 'Basic Info', icon: FileText },
  { id: 3, title: 'Location', icon: MapPin },
  { id: 4, title: 'Rooms & Beds', icon: Bed },
  { id: 5, title: 'Amenities', icon: Wifi },
  { id: 6, title: 'Photos', icon: Camera },
  { id: 7, title: 'Pricing', icon: DollarSign },
  { id: 8, title: 'Policies', icon: FileCheck },
  { id: 9, title: 'Owner Info', icon: User },
  { id: 10, title: 'Review', icon: CheckCircle }
]

const ListProperty = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [listingId, setListingId] = useState<string | null>(null)
  const [photos, setPhotos] = useState<File[]>([])
  const [uploadedImages, setUploadedImages] = useState<PropertyImage[]>([])
  const [expandedCategory, setExpandedCategory] = useState<string | null>('Popular')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form data state
  const [formData, setFormData] = useState<Partial<PropertyListing>>({
    name: '',
    type: 'hotel',
    star_rating: 3,
    description: '',
    short_description: '',
    tagline: '',
    languages_spoken: ['English'],
    location: {
      address: '',
      city: '',
      country: 'Sri Lanka',
      postal_code: ''
    },
    total_rooms: 1,
    max_guests: 2,
    rooms: [],
    amenities: [],
    images: [],
    pricing: {
      currency: 'USD',
      base_price_per_night: 0,
      infant_free: true
    },
    meal_plans_available: ['room_only'],
    restaurant_on_site: false,
    room_service_available: false,
    breakfast_included: false,
    policies: {
      check_in_time: '14:00',
      check_out_time: '11:00',
      early_check_in_available: false,
      late_check_out_available: false,
      cancellation_policy: 'moderate',
      cancellation_deadline_hours: 48,
      refund_percent: 50,
      min_nights: 1,
      max_nights: 30,
      children_allowed: true,
      pets_allowed: false,
      smoking_allowed: false,
      parties_allowed: false,
      id_required: true,
      house_rules: []
    },
    owner: {
      owner_name: '',
      owner_email: '',
      owner_phone: '',
      owner_whatsapp: '',
      business_type: 'individual'
    },
    is_instant_book: false
  })

  // Room state for adding new rooms
  const [newRoom, setNewRoom] = useState<Partial<RoomConfiguration>>({
    name: '',
    type: 'standard',
    description: '',
    max_guests: 2,
    num_rooms: 1,
    size_sqm: 25,
    beds: [{ type: 'double', count: 1 }],
    amenities: [],
    images: [],
    base_price: 0,
    is_smoking: false,
    has_balcony: false,
    has_view: false
  })

  // Auto-save draft
  useEffect(() => {
    const autoSave = async () => {
      if (listingId && formData.name) {
        setIsSaving(true)
        try {
          await propertyListingService.saveDraft(listingId, formData)
        } catch (error) {
          console.error('Auto-save failed:', error)
        }
        setIsSaving(false)
      }
    }

    const timer = setTimeout(autoSave, 5000)
    return () => clearTimeout(timer)
  }, [formData, listingId])

  // Handlers
  const updateFormData = useCallback((updates: Partial<PropertyListing>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }, [])

  const updateLocation = useCallback((updates: Partial<LocationDetails>) => {
    setFormData(prev => ({
      ...prev,
      location: { ...prev.location!, ...updates }
    }))
  }, [])

  const updatePricing = useCallback((updates: Partial<PricingConfig>) => {
    setFormData(prev => ({
      ...prev,
      pricing: { ...prev.pricing!, ...updates }
    }))
  }, [])

  const updatePolicies = useCallback((updates: Partial<PropertyPolicies>) => {
    setFormData(prev => ({
      ...prev,
      policies: { ...prev.policies!, ...updates }
    }))
  }, [])

  const updateOwner = useCallback((updates: Partial<OwnerDetails>) => {
    setFormData(prev => ({
      ...prev,
      owner: { ...prev.owner!, ...updates }
    }))
  }, [])

  const toggleAmenity = useCallback((amenityId: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities?.includes(amenityId)
        ? prev.amenities.filter(a => a !== amenityId)
        : [...(prev.amenities || []), amenityId]
    }))
  }, [])

  const toggleLanguage = useCallback((language: string) => {
    setFormData(prev => ({
      ...prev,
      languages_spoken: prev.languages_spoken?.includes(language)
        ? prev.languages_spoken.filter(l => l !== language)
        : [...(prev.languages_spoken || []), language]
    }))
  }, [])

  // Room management
  const addRoom = useCallback(() => {
    if (!newRoom.name || !newRoom.base_price) {
      toast({ title: 'Please fill in room name and price', variant: 'destructive' })
      return
    }

    const room: RoomConfiguration = {
      id: `room_${Date.now()}`,
      name: newRoom.name || '',
      type: newRoom.type as RoomType || 'standard',
      description: newRoom.description || '',
      max_guests: newRoom.max_guests || 2,
      num_rooms: newRoom.num_rooms || 1,
      size_sqm: newRoom.size_sqm,
      beds: newRoom.beds || [{ type: 'double', count: 1 }],
      amenities: newRoom.amenities || [],
      images: [],
      base_price: newRoom.base_price || 0,
      is_smoking: newRoom.is_smoking || false,
      has_balcony: newRoom.has_balcony || false,
      has_view: newRoom.has_view || false
    }

    setFormData(prev => ({
      ...prev,
      rooms: [...(prev.rooms || []), room],
      total_rooms: (prev.total_rooms || 0) + room.num_rooms
    }))

    // Reset new room form
    setNewRoom({
      name: '',
      type: 'standard',
      description: '',
      max_guests: 2,
      num_rooms: 1,
      size_sqm: 25,
      beds: [{ type: 'double', count: 1 }],
      amenities: [],
      images: [],
      base_price: 0,
      is_smoking: false,
      has_balcony: false,
      has_view: false
    })

    toast({ title: 'Room type added successfully!' })
  }, [newRoom, toast])

  const removeRoom = useCallback((roomId: string) => {
    setFormData(prev => {
      const roomToRemove = prev.rooms?.find(r => r.id === roomId)
      return {
        ...prev,
        rooms: prev.rooms?.filter(r => r.id !== roomId),
        total_rooms: (prev.total_rooms || 0) - (roomToRemove?.num_rooms || 0)
      }
    })
  }, [])

  // Photo handling
  const handlePhotoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files)
      setPhotos(prev => [...prev, ...newPhotos])
    }
  }, [])

  const removePhoto = useCallback((index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
    setPhotos(prev => [...prev, ...files])
  }, [])

  // Navigation
  const nextStep = useCallback(async () => {
    // Validation per step
    switch (currentStep) {
      case 1:
        if (!formData.type) {
          toast({ title: 'Please select a property type', variant: 'destructive' })
          return
        }
        break
      case 2:
        if (!formData.name || !formData.description) {
          toast({ title: 'Please fill in property name and description', variant: 'destructive' })
          return
        }
        break
      case 3:
        if (!formData.location?.city || !formData.location?.address) {
          toast({ title: 'Please fill in location details', variant: 'destructive' })
          return
        }
        break
      case 4:
        if (!formData.rooms || formData.rooms.length === 0) {
          toast({ title: 'Please add at least one room type', variant: 'destructive' })
          return
        }
        break
      case 6:
        if (photos.length < 5) {
          toast({ title: 'Please upload at least 5 photos', variant: 'destructive' })
          return
        }
        break
      case 7:
        if (!formData.pricing?.base_price_per_night || formData.pricing.base_price_per_night <= 0) {
          toast({ title: 'Please set a valid base price', variant: 'destructive' })
          return
        }
        break
      case 9:
        if (!formData.owner?.owner_name || !formData.owner?.owner_email || !formData.owner?.owner_phone) {
          toast({ title: 'Please fill in all owner details', variant: 'destructive' })
          return
        }
        break
    }

    // Create listing if not exists (after step 2)
    if (currentStep === 2 && !listingId) {
      try {
        const id = await propertyListingService.createListing(formData)
        setListingId(id)
        toast({ title: 'Draft saved!' })
      } catch (error) {
        toast({ title: 'Failed to save draft', variant: 'destructive' })
        return
      }
    }

    setCurrentStep(prev => Math.min(prev + 1, STEPS.length))
  }, [currentStep, formData, listingId, photos.length, toast])

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }, [])

  const goToStep = useCallback((step: number) => {
    if (step <= currentStep) {
      setCurrentStep(step)
    }
  }, [currentStep])

  // Submit
  const handleSubmit = async () => {
    if (!listingId) {
      toast({ title: 'Please complete all steps first', variant: 'destructive' })
      return
    }

    setIsSubmitting(true)

    try {
      // Upload photos
      if (photos.length > 0) {
        const uploaded = await propertyListingService.uploadImages(listingId, photos)
        await propertyListingService.updateListing(listingId, {
          ...formData,
          images: uploaded
        })
      } else {
        await propertyListingService.updateListing(listingId, formData)
      }

      // Submit for review
      await propertyListingService.submitForReview(listingId)

      setSubmitSuccess(true)
      toast({
        title: 'Application Submitted Successfully!',
        description: 'We will review your property within 24-48 hours.'
      })
    } catch (error: any) {
      toast({
        title: 'Submission Failed',
        description: error.message || 'Please try again later.',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Success Screen
  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full bg-white rounded-3xl shadow-2xl p-8 text-center"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Application Submitted!</h1>
          <p className="text-slate-600 mb-6">
            Thank you for choosing to partner with Recharge Travels. We've sent a confirmation email to{' '}
            <span className="font-semibold text-blue-600">{formData.owner?.owner_email}</span>.
          </p>

          <div className="bg-blue-50 rounded-2xl p-6 mb-6 text-left">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              What happens next?
            </h3>
            <ul className="space-y-3">
              {[
                'Our team reviews your property within 24-48 hours',
                'We may contact you for additional verification',
                'Once approved, your property goes live on our platform',
                "You'll receive booking notifications via email & WhatsApp"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-blue-800">
                  <div className="w-6 h-6 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">
                    {i + 1}
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => navigate('/')}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-12"
            >
              Return to Homepage
            </Button>
            <Button
              onClick={() => {
                setSubmitSuccess(false)
                setCurrentStep(1)
                setListingId(null)
                setPhotos([])
                setFormData({
                  name: '',
                  type: 'hotel',
                  star_rating: 3,
                  description: '',
                  languages_spoken: ['English'],
                  location: { address: '', city: '', country: 'Sri Lanka' },
                  total_rooms: 1,
                  max_guests: 2,
                  rooms: [],
                  amenities: [],
                  images: [],
                  pricing: { currency: 'USD', base_price_per_night: 0, infant_free: true },
                  meal_plans_available: ['room_only'],
                  restaurant_on_site: false,
                  room_service_available: false,
                  breakfast_included: false,
                  policies: {
                    check_in_time: '14:00',
                    check_out_time: '11:00',
                    early_check_in_available: false,
                    late_check_out_available: false,
                    cancellation_policy: 'moderate',
                    cancellation_deadline_hours: 48,
                    refund_percent: 50,
                    min_nights: 1,
                    max_nights: 30,
                    children_allowed: true,
                    pets_allowed: false,
                    smoking_allowed: false,
                    parties_allowed: false,
                    id_required: true,
                    house_rules: []
                  },
                  owner: {
                    owner_name: '',
                    owner_email: '',
                    owner_phone: '',
                    business_type: 'individual'
                  },
                  is_instant_book: false
                })
              }}
              variant="outline"
              className="flex-1 h-12"
            >
              List Another Property
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-[#003580] text-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8" />
              <div>
                <h1 className="text-xl font-bold">List Your Property</h1>
                <p className="text-sm text-blue-200">Partner with Recharge Travels</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {isSaving && (
                <span className="text-sm text-blue-200 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </span>
              )}
              <a
                href="https://wa.me/94777721999"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:text-blue-200 transition-colors"
              >
                <HelpCircle className="w-5 h-5" />
                Need Help?
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-white border-b shadow-sm sticky top-[72px] z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between overflow-x-auto pb-2">
            {STEPS.map((step, index) => {
              const isActive = step.id === currentStep
              const isCompleted = step.id < currentStep
              const isClickable = step.id <= currentStep

              return (
                <React.Fragment key={step.id}>
                  <button
                    onClick={() => goToStep(step.id)}
                    disabled={!isClickable}
                    className={`flex flex-col items-center gap-1 px-2 py-1 rounded-lg transition-all min-w-[80px] ${isClickable ? 'cursor-pointer hover:bg-slate-50' : 'cursor-not-allowed opacity-50'
                      }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isCompleted
                          ? 'bg-green-500 text-white'
                          : isActive
                            ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <step.icon className="w-5 h-5" />
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium whitespace-nowrap ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-slate-500'
                        }`}
                    >
                      {step.title}
                    </span>
                  </button>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-1 ${step.id < currentStep ? 'bg-green-500' : 'bg-slate-200'
                        }`}
                    />
                  )}
                </React.Fragment>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {/* Step 1: Property Type */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-slate-900 mb-3">
                    What type of property do you want to list?
                  </h2>
                  <p className="text-slate-600 max-w-xl mx-auto">
                    Choose the category that best describes your property. This helps travelers find exactly what they're looking for.
                  </p>
                </div>

                <div className="space-y-6">
                  {PROPERTY_TYPES.map((category) => (
                    <div key={category.category} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                      <h3 className="text-lg font-semibold text-slate-900 p-4 bg-slate-50 border-b">
                        {category.category}
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
                        {category.types.map((type) => {
                          const isSelected = formData.type === type.value
                          return (
                            <button
                              key={type.value}
                              onClick={() => updateFormData({ type: type.value })}
                              className={`p-4 rounded-xl border-2 transition-all text-left ${isSelected
                                  ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200'
                                  : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                                }`}
                            >
                              <type.icon
                                className={`w-8 h-8 mb-2 ${isSelected ? 'text-blue-600' : 'text-slate-400'
                                  }`}
                              />
                              <h4 className={`font-semibold ${isSelected ? 'text-blue-900' : 'text-slate-900'}`}>
                                {type.label}
                              </h4>
                              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                {type.description}
                              </p>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Basic Info */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-slate-900 mb-3">
                    Tell us about your property
                  </h2>
                  <p className="text-slate-600 max-w-xl mx-auto">
                    These details help guests understand what makes your property unique.
                  </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
                  {/* Property Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-base font-medium">
                      Property Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => updateFormData({ name: e.target.value })}
                      placeholder="e.g. The Ocean Villa Galle"
                      className="h-12 text-lg"
                    />
                    <p className="text-sm text-slate-500">
                      This is what guests will see when browsing properties
                    </p>
                  </div>

                  {/* Tagline */}
                  <div className="space-y-2">
                    <Label htmlFor="tagline" className="text-base font-medium">Tagline</Label>
                    <Input
                      id="tagline"
                      value={formData.tagline}
                      onChange={(e) => updateFormData({ tagline: e.target.value })}
                      placeholder="e.g. Luxury beachfront retreat with stunning ocean views"
                      className="h-12"
                    />
                  </div>

                  {/* Star Rating */}
                  <div className="space-y-2">
                    <Label className="text-base font-medium">Star Rating (if applicable)</Label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => updateFormData({ star_rating: star })}
                          className={`p-2 rounded-lg transition-all ${(formData.star_rating || 0) >= star
                              ? 'text-yellow-500'
                              : 'text-slate-300 hover:text-yellow-300'
                            }`}
                        >
                          <Star className="w-8 h-8 fill-current" />
                        </button>
                      ))}
                      <button
                        onClick={() => updateFormData({ star_rating: undefined })}
                        className="ml-4 text-sm text-slate-500 hover:text-slate-700"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  {/* Short Description */}
                  <div className="space-y-2">
                    <Label htmlFor="short_description" className="text-base font-medium">
                      Short Description
                    </Label>
                    <Textarea
                      id="short_description"
                      value={formData.short_description}
                      onChange={(e) => updateFormData({ short_description: e.target.value })}
                      placeholder="Brief summary in 1-2 sentences..."
                      className="min-h-[80px] resize-none"
                      maxLength={200}
                    />
                    <p className="text-sm text-slate-500 text-right">
                      {formData.short_description?.length || 0}/200 characters
                    </p>
                  </div>

                  {/* Full Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-base font-medium">
                      Full Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => updateFormData({ description: e.target.value })}
                      placeholder="Describe what makes your property special. Include details about the atmosphere, unique features, nearby attractions, and what guests can expect during their stay..."
                      className="min-h-[200px] resize-none"
                    />
                    <p className="text-sm text-slate-500">
                      Tip: Include details about views, atmosphere, nearby attractions, and unique experiences
                    </p>
                  </div>

                  {/* Languages Spoken */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Languages Spoken by Staff</Label>
                    <div className="flex flex-wrap gap-2">
                      {LANGUAGES.map((language) => (
                        <button
                          key={language}
                          onClick={() => toggleLanguage(language)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${formData.languages_spoken?.includes(language)
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                        >
                          {language}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Location */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-slate-900 mb-3">
                    Where is your property located?
                  </h2>
                  <p className="text-slate-600 max-w-xl mx-auto">
                    Help guests find your property by providing accurate location details.
                  </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
                  {/* Country */}
                  <div className="space-y-2">
                    <Label className="text-base font-medium">Country</Label>
                    <div className="h-12 px-4 rounded-lg bg-slate-100 flex items-center text-slate-700">
                      <Globe className="w-5 h-5 mr-3 text-slate-500" />
                      Sri Lanka
                    </div>
                  </div>

                  {/* City */}
                  <div className="space-y-2">
                    <Label className="text-base font-medium">
                      City / Town <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.location?.city}
                      onValueChange={(val) => updateLocation({ city: val })}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        {SRI_LANKAN_CITIES.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Street Address */}
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-base font-medium">
                      Street Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="address"
                      value={formData.location?.address}
                      onChange={(e) => updateLocation({ address: e.target.value })}
                      placeholder="e.g. 123 Beach Road, Fort"
                      className="h-12"
                    />
                  </div>

                  {/* Address Line 2 */}
                  <div className="space-y-2">
                    <Label htmlFor="address_line_2" className="text-base font-medium">
                      Address Line 2 (Optional)
                    </Label>
                    <Input
                      id="address_line_2"
                      value={formData.location?.address_line_2}
                      onChange={(e) => updateLocation({ address_line_2: e.target.value })}
                      placeholder="Apartment, suite, unit, building, floor, etc."
                      className="h-12"
                    />
                  </div>

                  {/* Postal Code & Neighborhood */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="postal_code" className="text-base font-medium">
                        Postal Code
                      </Label>
                      <Input
                        id="postal_code"
                        value={formData.location?.postal_code}
                        onChange={(e) => updateLocation({ postal_code: e.target.value })}
                        placeholder="e.g. 80000"
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="neighborhood" className="text-base font-medium">
                        Neighborhood / Area
                      </Label>
                      <Input
                        id="neighborhood"
                        value={formData.location?.neighborhood}
                        onChange={(e) => updateLocation({ neighborhood: e.target.value })}
                        placeholder="e.g. Galle Fort"
                        className="h-12"
                      />
                    </div>
                  </div>

                  {/* Distances */}
                  <div className="border-t pt-6 mt-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
                      Distance to Key Locations (Optional)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">To Airport (km)</Label>
                        <Input
                          type="number"
                          value={formData.location?.distance_to_airport_km || ''}
                          onChange={(e) => updateLocation({ distance_to_airport_km: Number(e.target.value) })}
                          placeholder="e.g. 15"
                          className="h-10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">To City Center (km)</Label>
                        <Input
                          type="number"
                          value={formData.location?.distance_to_city_center_km || ''}
                          onChange={(e) => updateLocation({ distance_to_city_center_km: Number(e.target.value) })}
                          placeholder="e.g. 5"
                          className="h-10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">To Beach (km)</Label>
                        <Input
                          type="number"
                          value={formData.location?.distance_to_beach_km || ''}
                          onChange={(e) => updateLocation({ distance_to_beach_km: Number(e.target.value) })}
                          placeholder="e.g. 0.5"
                          className="h-10"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Rooms & Beds */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-slate-900 mb-3">
                    What rooms do you offer?
                  </h2>
                  <p className="text-slate-600 max-w-xl mx-auto">
                    Add the different room types available at your property with their details and pricing.
                  </p>
                </div>

                {/* Existing Rooms */}
                {formData.rooms && formData.rooms.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900">Added Room Types</h3>
                    {formData.rooms.map((room) => (
                      <div
                        key={room.id}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Bed className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900">{room.name}</h4>
                            <p className="text-sm text-slate-500">
                              {room.num_rooms} room(s) • Up to {room.max_guests} guests • ${room.base_price}/night
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeRoom(room.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add New Room Form */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Add Room Type
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Room Name */}
                    <div className="space-y-2">
                      <Label className="text-base font-medium">Room Name</Label>
                      <Input
                        value={newRoom.name}
                        onChange={(e) => setNewRoom(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g. Deluxe Ocean View"
                        className="h-12"
                      />
                    </div>

                    {/* Room Type */}
                    <div className="space-y-2">
                      <Label className="text-base font-medium">Room Type</Label>
                      <Select
                        value={newRoom.type}
                        onValueChange={(val) => setNewRoom(prev => ({ ...prev, type: val as RoomType }))}
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {ROOM_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {/* Number of this room type */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">How Many?</Label>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => setNewRoom(prev => ({ ...prev, num_rooms: Math.max(1, (prev.num_rooms || 1) - 1) }))}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-12 text-center font-semibold">{newRoom.num_rooms}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => setNewRoom(prev => ({ ...prev, num_rooms: (prev.num_rooms || 1) + 1 }))}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Max Guests */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Max Guests</Label>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => setNewRoom(prev => ({ ...prev, max_guests: Math.max(1, (prev.max_guests || 2) - 1) }))}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-12 text-center font-semibold">{newRoom.max_guests}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => setNewRoom(prev => ({ ...prev, max_guests: (prev.max_guests || 2) + 1 }))}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Room Size */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Size (sqm)</Label>
                      <Input
                        type="number"
                        value={newRoom.size_sqm || ''}
                        onChange={(e) => setNewRoom(prev => ({ ...prev, size_sqm: Number(e.target.value) }))}
                        placeholder="25"
                        className="h-10"
                      />
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Price/Night (USD)</Label>
                      <Input
                        type="number"
                        value={newRoom.base_price || ''}
                        onChange={(e) => setNewRoom(prev => ({ ...prev, base_price: Number(e.target.value) }))}
                        placeholder="100"
                        className="h-10"
                      />
                    </div>
                  </div>

                  {/* Bed Type */}
                  <div className="space-y-2">
                    <Label className="text-base font-medium">Bed Type</Label>
                    <Select
                      value={newRoom.beds?.[0]?.type}
                      onValueChange={(val) => setNewRoom(prev => ({
                        ...prev,
                        beds: [{ type: val as BedType, count: 1 }]
                      }))}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select bed type" />
                      </SelectTrigger>
                      <SelectContent>
                        {BED_TYPES.map((bed) => (
                          <SelectItem key={bed.value} value={bed.value}>
                            {bed.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Room Features */}
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={newRoom.has_balcony}
                        onCheckedChange={(checked) => setNewRoom(prev => ({ ...prev, has_balcony: !!checked }))}
                      />
                      <span className="text-sm">Balcony/Terrace</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={newRoom.has_view}
                        onCheckedChange={(checked) => setNewRoom(prev => ({ ...prev, has_view: !!checked }))}
                      />
                      <span className="text-sm">Has View</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={newRoom.is_smoking}
                        onCheckedChange={(checked) => setNewRoom(prev => ({ ...prev, is_smoking: !!checked }))}
                      />
                      <span className="text-sm">Smoking Allowed</span>
                    </label>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label className="text-base font-medium">Room Description</Label>
                    <Textarea
                      value={newRoom.description}
                      onChange={(e) => setNewRoom(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe this room type..."
                      className="min-h-[100px] resize-none"
                    />
                  </div>

                  <Button onClick={addRoom} className="w-full h-12 bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-5 h-5 mr-2" />
                    Add This Room Type
                  </Button>
                </div>

                {/* Summary */}
                {formData.rooms && formData.rooms.length > 0 && (
                  <div className="bg-blue-50 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-blue-900">Total:</span>
                      <span className="ml-2 text-blue-700">
                        {formData.rooms.length} room type(s) • {formData.total_rooms} total rooms
                      </span>
                    </div>
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 5: Amenities */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-slate-900 mb-3">
                    What amenities do you offer?
                  </h2>
                  <p className="text-slate-600 max-w-xl mx-auto">
                    Select all amenities available at your property. More amenities help attract more guests.
                  </p>
                </div>

                <div className="space-y-4">
                  {Object.entries(AMENITIES_BY_CATEGORY).map(([category, amenities]) => (
                    <div
                      key={category}
                      className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
                        className="w-full p-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
                      >
                        <span className="font-semibold text-slate-900">{category}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-500">
                            {amenities.filter(a => formData.amenities?.includes(a.id)).length}/{amenities.length} selected
                          </span>
                          <ChevronDown
                            className={`w-5 h-5 text-slate-500 transition-transform ${expandedCategory === category ? 'rotate-180' : ''
                              }`}
                          />
                        </div>
                      </button>
                      <AnimatePresence>
                        {expandedCategory === category && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4">
                              {amenities.map((amenity) => {
                                const isSelected = formData.amenities?.includes(amenity.id)
                                return (
                                  <button
                                    key={amenity.id}
                                    onClick={() => toggleAmenity(amenity.id)}
                                    className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${isSelected
                                        ? 'border-blue-600 bg-blue-50'
                                        : 'border-slate-200 hover:border-blue-300'
                                      }`}
                                  >
                                    <amenity.icon
                                      className={`w-6 h-6 ${isSelected ? 'text-blue-600' : 'text-slate-400'
                                        }`}
                                    />
                                    <span
                                      className={`text-sm font-medium ${isSelected ? 'text-blue-900' : 'text-slate-700'
                                        }`}
                                    >
                                      {amenity.label}
                                    </span>
                                    {isSelected && (
                                      <Check className="w-5 h-5 text-blue-600 ml-auto" />
                                    )}
                                  </button>
                                )
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>

                {/* Selected count */}
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <span className="text-blue-900 font-medium">
                    {formData.amenities?.length || 0} amenities selected
                  </span>
                </div>
              </motion.div>
            )}

            {/* Step 6: Photos */}
            {currentStep === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-slate-900 mb-3">
                    Show off your property
                  </h2>
                  <p className="text-slate-600 max-w-xl mx-auto">
                    High-quality photos can increase your bookings by up to 2x. Upload at least 5 photos.
                  </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
                  {/* Upload Zone */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="border-2 border-dashed border-slate-300 rounded-2xl p-10 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group"
                  >
                    <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Upload className="h-10 w-10" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      Click to upload or drag and drop
                    </h3>
                    <p className="text-slate-500">
                      PNG, JPG up to 10MB each. Minimum 5 photos required.
                    </p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      multiple
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </div>

                  {/* Photo Tips */}
                  <div className="bg-amber-50 rounded-xl p-4">
                    <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Tips for great photos
                    </h4>
                    <ul className="text-sm text-amber-800 space-y-1">
                      <li>• Use natural daylight for the best results</li>
                      <li>• Include exterior, rooms, bathrooms, and amenities</li>
                      <li>• Show the view from windows if available</li>
                      <li>• Keep photos landscape orientation</li>
                    </ul>
                  </div>

                  {/* Photo Preview Grid */}
                  {photos.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-slate-900">
                        Uploaded Photos ({photos.length})
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {photos.map((photo, index) => (
                          <div
                            key={index}
                            className="relative aspect-[4/3] rounded-xl overflow-hidden group shadow-sm border"
                          >
                            <img
                              src={URL.createObjectURL(photo)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            {index === 0 && (
                              <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                                Cover Photo
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removePhoto(index)
                                }}
                                className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Progress indicator */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${photos.length >= 5 ? 'bg-green-500' : 'bg-blue-600'
                          }`}
                        style={{ width: `${Math.min((photos.length / 5) * 100, 100)}%` }}
                      />
                    </div>
                    <span className={`text-sm font-medium ${photos.length >= 5 ? 'text-green-600' : 'text-slate-600'
                      }`}>
                      {photos.length}/5 minimum
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 7: Pricing */}
            {currentStep === 7 && (
              <motion.div
                key="step7"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-slate-900 mb-3">
                    Set your pricing
                  </h2>
                  <p className="text-slate-600 max-w-xl mx-auto">
                    Configure your base pricing and any additional fees. You can always adjust these later.
                  </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
                  {/* Currency & Base Price */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-base font-medium">Currency</Label>
                      <Select
                        value={formData.pricing?.currency}
                        onValueChange={(val) => updatePricing({ currency: val })}
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD - US Dollar</SelectItem>
                          <SelectItem value="EUR">EUR - Euro</SelectItem>
                          <SelectItem value="GBP">GBP - British Pound</SelectItem>
                          <SelectItem value="LKR">LKR - Sri Lankan Rupee</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-base font-medium">
                        Base Price per Night <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                          type="number"
                          value={formData.pricing?.base_price_per_night || ''}
                          onChange={(e) => updatePricing({ base_price_per_night: Number(e.target.value) })}
                          className="pl-10 h-12 text-lg font-semibold"
                          placeholder="100"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Weekend Price */}
                  <div className="space-y-2">
                    <Label className="text-base font-medium">Weekend Price per Night (Optional)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        type="number"
                        value={formData.pricing?.weekend_price_per_night || ''}
                        onChange={(e) => updatePricing({ weekend_price_per_night: Number(e.target.value) })}
                        className="pl-10 h-12"
                        placeholder="Leave empty for same as base price"
                      />
                    </div>
                  </div>

                  {/* Discounts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-base font-medium">Weekly Discount %</Label>
                      <Input
                        type="number"
                        value={formData.pricing?.weekly_discount_percent || ''}
                        onChange={(e) => updatePricing({ weekly_discount_percent: Number(e.target.value) })}
                        className="h-12"
                        placeholder="e.g. 10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-base font-medium">Monthly Discount %</Label>
                      <Input
                        type="number"
                        value={formData.pricing?.monthly_discount_percent || ''}
                        onChange={(e) => updatePricing({ monthly_discount_percent: Number(e.target.value) })}
                        className="h-12"
                        placeholder="e.g. 20"
                      />
                    </div>
                  </div>

                  {/* Additional Fees */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Additional Fees</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Cleaning Fee</Label>
                        <Input
                          type="number"
                          value={formData.pricing?.cleaning_fee || ''}
                          onChange={(e) => updatePricing({ cleaning_fee: Number(e.target.value) })}
                          className="h-10"
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Service Fee %</Label>
                        <Input
                          type="number"
                          value={formData.pricing?.service_fee_percent || ''}
                          onChange={(e) => updatePricing({ service_fee_percent: Number(e.target.value) })}
                          className="h-10"
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Tax %</Label>
                        <Input
                          type="number"
                          value={formData.pricing?.tax_percent || ''}
                          onChange={(e) => updatePricing({ tax_percent: Number(e.target.value) })}
                          className="h-10"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Extra Guest Charge */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-base font-medium">Extra Guest Charge</Label>
                      <Input
                        type="number"
                        value={formData.pricing?.extra_guest_charge || ''}
                        onChange={(e) => updatePricing({ extra_guest_charge: Number(e.target.value) })}
                        className="h-12"
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-base font-medium">Child Discount %</Label>
                      <Input
                        type="number"
                        value={formData.pricing?.child_discount_percent || ''}
                        onChange={(e) => updatePricing({ child_discount_percent: Number(e.target.value) })}
                        className="h-12"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* Infant Free */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-slate-900">Infants Stay Free</h4>
                      <p className="text-sm text-slate-500">Children under 2 years stay for free</p>
                    </div>
                    <Switch
                      checked={formData.pricing?.infant_free}
                      onCheckedChange={(checked) => updatePricing({ infant_free: checked })}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 8: Policies */}
            {currentStep === 8 && (
              <motion.div
                key="step8"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-slate-900 mb-3">
                    Set your house rules & policies
                  </h2>
                  <p className="text-slate-600 max-w-xl mx-auto">
                    Clear policies help set expectations and reduce misunderstandings with guests.
                  </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
                  {/* Check-in/out Times */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-base font-medium">Check-in Time</Label>
                      <Input
                        type="time"
                        value={formData.policies?.check_in_time}
                        onChange={(e) => updatePolicies({ check_in_time: e.target.value })}
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-base font-medium">Check-out Time</Label>
                      <Input
                        type="time"
                        value={formData.policies?.check_out_time}
                        onChange={(e) => updatePolicies({ check_out_time: e.target.value })}
                        className="h-12"
                      />
                    </div>
                  </div>

                  {/* Flexible Check-in/out */}
                  <div className="flex flex-wrap gap-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <Checkbox
                        checked={formData.policies?.early_check_in_available}
                        onCheckedChange={(checked) => updatePolicies({ early_check_in_available: !!checked })}
                      />
                      <span>Early check-in available</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <Checkbox
                        checked={formData.policies?.late_check_out_available}
                        onCheckedChange={(checked) => updatePolicies({ late_check_out_available: !!checked })}
                      />
                      <span>Late check-out available</span>
                    </label>
                  </div>

                  {/* Cancellation Policy */}
                  <div className="space-y-2">
                    <Label className="text-base font-medium">Cancellation Policy</Label>
                    <Select
                      value={formData.policies?.cancellation_policy}
                      onValueChange={(val) => updatePolicies({ cancellation_policy: val as CancellationPolicy })}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flexible">Flexible - Full refund up to 24 hours before</SelectItem>
                        <SelectItem value="moderate">Moderate - Full refund up to 5 days before</SelectItem>
                        <SelectItem value="strict">Strict - 50% refund up to 7 days before</SelectItem>
                        <SelectItem value="non_refundable">Non-refundable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Min/Max Nights */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-base font-medium">Minimum Nights</Label>
                      <Input
                        type="number"
                        value={formData.policies?.min_nights}
                        onChange={(e) => updatePolicies({ min_nights: Number(e.target.value) })}
                        className="h-12"
                        min="1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-base font-medium">Maximum Nights</Label>
                      <Input
                        type="number"
                        value={formData.policies?.max_nights}
                        onChange={(e) => updatePolicies({ max_nights: Number(e.target.value) })}
                        className="h-12"
                      />
                    </div>
                  </div>

                  {/* House Rules */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">House Rules</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        { key: 'children_allowed', label: 'Children Allowed', defaultChecked: true },
                        { key: 'pets_allowed', label: 'Pets Allowed', defaultChecked: false },
                        { key: 'smoking_allowed', label: 'Smoking Allowed', defaultChecked: false },
                        { key: 'parties_allowed', label: 'Events/Parties Allowed', defaultChecked: false },
                        { key: 'id_required', label: 'ID Required at Check-in', defaultChecked: true }
                      ].map((rule) => (
                        <label key={rule.key} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-slate-50">
                          <Switch
                            checked={formData.policies?.[rule.key as keyof PropertyPolicies] as boolean}
                            onCheckedChange={(checked) => updatePolicies({ [rule.key]: checked })}
                          />
                          <span className="text-sm">{rule.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Damage Deposit */}
                  <div className="space-y-2">
                    <Label className="text-base font-medium">Security Deposit (Optional)</Label>
                    <Input
                      type="number"
                      value={formData.policies?.damage_deposit || ''}
                      onChange={(e) => updatePolicies({ damage_deposit: Number(e.target.value) })}
                      className="h-12"
                      placeholder="Amount in your currency"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 9: Owner Info */}
            {currentStep === 9 && (
              <motion.div
                key="step9"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-slate-900 mb-3">
                    Your contact information
                  </h2>
                  <p className="text-slate-600 max-w-xl mx-auto">
                    This information is used to contact you about bookings and your listing.
                  </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
                  {/* Business Type */}
                  <div className="space-y-2">
                    <Label className="text-base font-medium">I am a...</Label>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { value: 'individual', label: 'Individual', icon: User },
                        { value: 'company', label: 'Company', icon: Building2 },
                        { value: 'partnership', label: 'Partnership', icon: Users }
                      ].map((type) => (
                        <button
                          key={type.value}
                          onClick={() => updateOwner({ business_type: type.value as OwnerDetails['business_type'] })}
                          className={`p-4 rounded-xl border-2 transition-all ${formData.owner?.business_type === type.value
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-slate-200 hover:border-blue-300'
                            }`}
                        >
                          <type.icon className={`w-8 h-8 mx-auto mb-2 ${formData.owner?.business_type === type.value ? 'text-blue-600' : 'text-slate-400'
                            }`} />
                          <span className={`text-sm font-medium ${formData.owner?.business_type === type.value ? 'text-blue-900' : 'text-slate-700'
                            }`}>
                            {type.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name */}
                  <div className="space-y-2">
                    <Label className="text-base font-medium">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        value={formData.owner?.owner_name}
                        onChange={(e) => updateOwner({ owner_name: e.target.value })}
                        className="pl-10 h-12"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label className="text-base font-medium">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        type="email"
                        value={formData.owner?.owner_email}
                        onChange={(e) => updateOwner({ owner_email: e.target.value })}
                        className="pl-10 h-12"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  {/* Phone Numbers */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-base font-medium">
                        Phone Number <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                          value={formData.owner?.owner_phone}
                          onChange={(e) => updateOwner({ owner_phone: e.target.value })}
                          className="pl-10 h-12"
                          placeholder="+94 77 123 4567"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-base font-medium">WhatsApp Number</Label>
                      <div className="relative">
                        <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                          value={formData.owner?.owner_whatsapp}
                          onChange={(e) => updateOwner({ owner_whatsapp: e.target.value })}
                          className="pl-10 h-12"
                          placeholder="+94 77 123 4567"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Business Details (if company/partnership) */}
                  {formData.owner?.business_type !== 'individual' && (
                    <div className="border-t pt-6 space-y-4">
                      <h3 className="text-lg font-semibold text-slate-900">Business Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-base font-medium">Business Name</Label>
                          <Input
                            value={formData.owner?.business_name}
                            onChange={(e) => updateOwner({ business_name: e.target.value })}
                            className="h-12"
                            placeholder="Your business name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-base font-medium">Registration Number</Label>
                          <Input
                            value={formData.owner?.business_registration}
                            onChange={(e) => updateOwner({ business_registration: e.target.value })}
                            className="h-12"
                            placeholder="Business registration #"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-base font-medium">Tax Number (optional)</Label>
                        <Input
                          value={formData.owner?.tax_number}
                          onChange={(e) => updateOwner({ tax_number: e.target.value })}
                          className="h-12"
                          placeholder="Tax identification number"
                        />
                      </div>
                    </div>
                  )}

                  {/* Instant Book */}
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-blue-900 flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        Enable Instant Book
                      </h4>
                      <p className="text-sm text-blue-700">
                        Let guests book instantly without waiting for your approval
                      </p>
                    </div>
                    <Switch
                      checked={formData.is_instant_book}
                      onCheckedChange={(checked) => updateFormData({ is_instant_book: checked })}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 10: Review */}
            {currentStep === 10 && (
              <motion.div
                key="step10"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-slate-900 mb-3">
                    Review your listing
                  </h2>
                  <p className="text-slate-600 max-w-xl mx-auto">
                    Make sure everything looks good before submitting for review.
                  </p>
                </div>

                {/* Review Summary */}
                <div className="space-y-4">
                  {/* Property Overview */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-slate-900">Property Overview</h3>
                      <Button variant="ghost" size="sm" onClick={() => goToStep(2)}>
                        Edit
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-500">Name</p>
                        <p className="font-medium">{formData.name || 'Not set'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Type</p>
                        <p className="font-medium capitalize">{formData.type?.replace(/_/g, ' ') || 'Not set'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Location</p>
                        <p className="font-medium">{formData.location?.city || 'Not set'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Star Rating</p>
                        <p className="font-medium">{formData.star_rating ? `${formData.star_rating} Stars` : 'Not rated'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Rooms & Pricing */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-slate-900">Rooms & Pricing</h3>
                      <Button variant="ghost" size="sm" onClick={() => goToStep(4)}>
                        Edit
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-500">Room Types</p>
                        <p className="font-medium">{formData.rooms?.length || 0} types configured</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Total Rooms</p>
                        <p className="font-medium">{formData.total_rooms || 0}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Base Price</p>
                        <p className="font-medium">
                          {formData.pricing?.currency} {formData.pricing?.base_price_per_night || 0}/night
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Amenities</p>
                        <p className="font-medium">{formData.amenities?.length || 0} selected</p>
                      </div>
                    </div>
                  </div>

                  {/* Photos */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-slate-900">Photos</h3>
                      <Button variant="ghost" size="sm" onClick={() => goToStep(6)}>
                        Edit
                      </Button>
                    </div>
                    {photos.length > 0 ? (
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {photos.slice(0, 5).map((photo, i) => (
                          <img
                            key={i}
                            src={URL.createObjectURL(photo)}
                            alt={`Photo ${i + 1}`}
                            className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                          />
                        ))}
                        {photos.length > 5 && (
                          <div className="w-24 h-24 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-slate-500 font-medium">+{photos.length - 5}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-slate-500">No photos uploaded</p>
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-slate-900">Contact Information</h3>
                      <Button variant="ghost" size="sm" onClick={() => goToStep(9)}>
                        Edit
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-500">Name</p>
                        <p className="font-medium">{formData.owner?.owner_name || 'Not set'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Email</p>
                        <p className="font-medium">{formData.owner?.owner_email || 'Not set'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Phone</p>
                        <p className="font-medium">{formData.owner?.owner_phone || 'Not set'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Business Type</p>
                        <p className="font-medium capitalize">{formData.owner?.business_type || 'Not set'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terms & Submit */}
                <div className="bg-blue-50 rounded-2xl p-6 space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <Checkbox className="mt-1" />
                    <span className="text-sm text-slate-700">
                      I confirm that all information provided is accurate and I have the authority to list this property.
                      I agree to the <a href="#" className="text-blue-600 underline">Terms of Service</a> and{' '}
                      <a href="#" className="text-blue-600 underline">Partner Agreement</a>.
                    </span>
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="mt-10 flex items-center justify-between">
            {currentStep > 1 ? (
              <Button
                variant="outline"
                onClick={prevStep}
                className="h-12 px-6"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
            ) : (
              <div />
            )}

            {currentStep < STEPS.length ? (
              <Button
                onClick={nextStep}
                className="h-12 px-8 bg-blue-600 hover:bg-blue-700"
              >
                Continue
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="h-12 px-8 bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Submit for Review
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </main>

      {/* Footer Help */}
      <div className="fixed bottom-4 right-4">
        <a
          href="https://wa.me/94777721999"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-green-500 text-white px-4 py-3 rounded-full shadow-lg hover:bg-green-600 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="font-medium">Chat with us</span>
        </a>
      </div>
    </div>
  )
}

export default ListProperty
