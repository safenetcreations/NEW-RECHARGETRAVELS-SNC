import React, { useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useToast } from '@/hooks/use-toast'
import { auth } from '@/lib/firebase'
import { useNavigate } from 'react-router-dom'
import {
  addDriverDocument,
  addDriverPhoto,
  createOrUpdateDriverProfile,
  initializeDriverWallet
} from '@/services/driverOnboardingService'
import { DriverTier, DocumentType, PhotoType } from '@/types/driver'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import LiveCapture from '@/components/ui/LiveCapture'
import LivenessRecorder from '@/components/ui/LivenessRecorder'
import { Check, ChevronRight, Upload, Camera, User, FileText, Shield, AlertCircle, Car, Phone, Mail, MapPin, Building, CreditCard, Star, Clock, BadgeCheck } from 'lucide-react'

const roleDocs: Record<DriverTier, DocumentType[]> = {
  chauffeur_guide: ['slt_da_license', 'driving_license', 'national_id', 'police_clearance', 'medical_report', 'vehicle_revenue_license', 'vehicle_insurance'],
  national_guide: ['slt_da_license', 'driving_license', 'national_id', 'police_clearance', 'medical_report'],
  tourist_driver: ['driving_license', 'national_id', 'police_clearance', 'vehicle_revenue_license', 'vehicle_insurance'],
  freelance_driver: ['driving_license', 'national_id', 'vehicle_revenue_license', 'vehicle_insurance']
}

const tierInfo: Record<DriverTier, { label: string; description: string; benefits: string[]; icon: string }> = {
  chauffeur_guide: {
    label: 'Chauffeur Tourist Guide (SLTDA)',
    description: 'Premium tier for SLTDA certified guides with own vehicle',
    benefits: ['Premium bookings', 'SLTDA verified badge', 'Higher earnings', 'Priority support', 'Featured listing'],
    icon: '🏆'
  },
  national_guide: {
    label: 'National Tourist Guide',
    description: 'Certified national guides for cultural and heritage tours',
    benefits: ['Certified guide badge', 'Cultural tour access', 'Multi-language support', 'Training programs'],
    icon: '🎯'
  },
  tourist_driver: {
    label: 'SLITHM Tourist Driver',
    description: 'SLITHM certified drivers for tourist transportation',
    benefits: ['Tourist-ready badge', 'Airport transfer priority', 'Hotel partnerships', 'Insurance coverage'],
    icon: '🚗'
  },
  freelance_driver: {
    label: 'Freelance / Standard Driver',
    description: 'Independent drivers for local and short trips',
    benefits: ['Flexible schedule', 'Quick approval', 'Local bookings', 'Basic support'],
    icon: '🚙'
  }
}

const prettyDoc: Record<DocumentType, string> = {
  national_id: 'National ID',
  driving_license: 'Driving License',
  slt_da_license: 'SLTDA Guide/Driver License',
  police_clearance: 'Police Clearance',
  medical_report: 'Medical Report',
  grama_niladari_certificate: 'Grama Niladhari Certificate',
  vehicle_revenue_license: 'Vehicle Revenue License',
  vehicle_insurance: 'Vehicle Insurance',
  vehicle_registration: 'Vehicle Registration',
  vehicle_permit: 'Vehicle Permit'
}

const livePhotoTypes: PhotoType[] = ['selfie_with_id', 'vehicle_front', 'vehicle_back', 'vehicle_side', 'vehicle_interior', 'video_intro']

interface FileMap {
  [key: string]: File | null
}

interface ValidationErrors {
  [key: string]: string
}

const steps = [
  { id: 1, title: 'Profile', icon: User, description: 'Personal & vehicle info' },
  { id: 2, title: 'Documents', icon: FileText, description: 'Upload required docs' },
  { id: 3, title: 'Live Capture', icon: Camera, description: 'Photos & verification' },
  { id: 4, title: 'Review', icon: Shield, description: 'Confirm & submit' }
]

const JoinUsDrivers: React.FC = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  // Profile fields
  const [tier, setTier] = useState<DriverTier>('freelance_driver')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [bio, setBio] = useState('')
  const [languages, setLanguages] = useState('English, Sinhala')
  const [experience, setExperience] = useState<number>(3)
  const [hourlyRate, setHourlyRate] = useState<number>(0)
  const [dailyRate, setDailyRate] = useState<number>(0)
  const [sltdaNumber, setSltdaNumber] = useState('')
  const [sltdaExpiry, setSltdaExpiry] = useState('')
  const [policeExpiry, setPoliceExpiry] = useState('')
  const [medicalExpiry, setMedicalExpiry] = useState('')
  const [socialInsta, setSocialInsta] = useState('')
  const [socialFacebook, setSocialFacebook] = useState('')

  // Emergency Contact
  const [emergencyName, setEmergencyName] = useState('')
  const [emergencyPhone, setEmergencyPhone] = useState('')
  const [emergencyRelation, setEmergencyRelation] = useState('')

  // Bank Details
  const [bankName, setBankName] = useState('')
  const [bankAccount, setBankAccount] = useState('')
  const [bankBranch, setBankBranch] = useState('')
  const [accountHolder, setAccountHolder] = useState('')

  const [vehicle, setVehicle] = useState({
    type: 'suv',
    registration: '',
    makeModelYear: '',
    seats: 4,
    color: '',
    ac: true,
    wifi: false
  })

  const [docs, setDocs] = useState<FileMap>({})
  const [photos, setPhotos] = useState<FileMap>({})

  const requiredDocs = useMemo(() => roleDocs[tier] || [], [tier])

  const handleFile = (setter: React.Dispatch<React.SetStateAction<FileMap>>, key: string, fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return
    const file = fileList[0]
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Maximum file size is 10MB', variant: 'destructive' })
      return
    }
    setter((prev) => ({ ...prev, [key]: file }))
  }

  const validateStep1 = (): boolean => {
    const newErrors: ValidationErrors = {}

    if (!fullName.trim()) newErrors.fullName = 'Full name is required'
    if (!email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email format'
    if (!phone.trim()) newErrors.phone = 'Phone is required'
    else if (!/^\+?[0-9]{10,15}$/.test(phone.replace(/\s/g, ''))) newErrors.phone = 'Invalid phone number'
    if (!vehicle.registration.trim()) newErrors.vehicleReg = 'Vehicle registration is required'
    if (!vehicle.makeModelYear.trim()) newErrors.vehicleMake = 'Vehicle make/model is required'
    if (experience < 0) newErrors.experience = 'Experience cannot be negative'
    if ((tier === 'chauffeur_guide' || tier === 'national_guide') && !sltdaNumber.trim()) {
      newErrors.sltda = 'SLTDA license number is required for this tier'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = (): boolean => {
    const newErrors: ValidationErrors = {}
    const uploadedDocs = Object.keys(docs).filter(k => docs[k])

    if (uploadedDocs.length < requiredDocs.length) {
      newErrors.docs = `Please upload all ${requiredDocs.length} required documents`
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep3 = (): boolean => {
    const newErrors: ValidationErrors = {}
    const requiredPhotos = ['selfie_with_id', 'vehicle_front']
    const uploadedPhotos = Object.keys(photos).filter(k => photos[k])

    for (const p of requiredPhotos) {
      if (!uploadedPhotos.includes(p)) {
        newErrors.photos = 'Please capture selfie with ID and vehicle front photo'
        break
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    let valid = true
    if (step === 1) valid = validateStep1()
    else if (step === 2) valid = validateStep2()
    else if (step === 3) valid = validateStep3()

    if (valid) {
      setStep((s) => Math.min(s + 1, 4))
      setErrors({})
    }
  }

  const prevStep = () => setStep((s) => Math.max(s - 1, 1))

  const getCompletionPercentage = (): number => {
    let total = 0
    let completed = 0

    // Profile fields (40%)
    const profileFields = [fullName, email, phone, vehicle.registration, vehicle.makeModelYear]
    total += profileFields.length
    completed += profileFields.filter(f => f.trim()).length

    // Documents (30%)
    total += requiredDocs.length
    completed += Object.values(docs).filter(Boolean).length

    // Photos (30%)
    const requiredPhotos = ['selfie_with_id', 'vehicle_front']
    total += requiredPhotos.length
    completed += requiredPhotos.filter(p => photos[p]).length

    return Math.round((completed / total) * 100)
  }

  const submit = async () => {
    if (!agreedToTerms) {
      toast({ title: 'Terms Required', description: 'Please agree to the terms and conditions.', variant: 'destructive' })
      return
    }

    const userId = auth?.currentUser?.uid
    if (!userId) {
      toast({ title: 'Please sign in', description: 'You need to be logged in to submit your profile.', variant: 'destructive' })
      navigate('/login')
      return
    }

    setLoading(true)
    try {
      // Create driver profile with all fields
      await createOrUpdateDriverProfile(userId, {
        full_name: fullName,
        email,
        phone,
        whatsapp: whatsapp || phone,
        address,
        city,
        tier,
        biography: bio,
        specialty_languages: languages.split(',').map((l) => l.trim()),
        years_experience: experience,
        hourly_rate: hourlyRate || undefined,
        daily_rate: dailyRate || undefined,
        vehicle_preference: 'own_vehicle',
        vehicle_type: vehicle.type as any,
        vehicle_registration: vehicle.registration,
        vehicle_make_model: vehicle.makeModelYear,
        vehicle_capacity: vehicle.seats,
        vehicle_color: vehicle.color,
        vehicle_ac: vehicle.ac,
        vehicle_wifi: vehicle.wifi,
        sltda_license_number: sltdaNumber || undefined,
        sltda_license_expiry: sltdaExpiry || undefined,
        police_clearance_expiry: policeExpiry || undefined,
        medical_report_expiry: medicalExpiry || undefined,
        social_insta: socialInsta || undefined,
        social_facebook: socialFacebook || undefined,
        emergency_contact_name: emergencyName || undefined,
        emergency_contact_phone: emergencyPhone || undefined,
        emergency_contact_relation: emergencyRelation || undefined,
        bank_name: bankName || undefined,
        bank_account_number: bankAccount || undefined,
        bank_branch: bankBranch || undefined,
        bank_account_holder: accountHolder || undefined,
        current_status: 'pending_verification',
        verified_level: 1,
        application_submitted_at: new Date().toISOString()
      })

      // Initialize wallet
      await initializeDriverWallet(userId, 'LKR')

      // Upload docs
      for (const docType of requiredDocs) {
        const file = docs[docType]
        if (file) {
          await addDriverDocument(userId, docType, file)
        }
      }

      // Upload live photos/videos
      for (const p of livePhotoTypes) {
        const file = photos[p]
        if (file) {
          const uploaded = await addDriverPhoto(userId, p, file, { isMobileCapture: true })
          if (p === 'video_intro') {
            await createOrUpdateDriverProfile(userId, { live_video_url: uploaded.file_path })
          }
        }
      }

      toast({
        title: 'Application Submitted!',
        description: 'Our team will review your documents within 24-48 hours. You will receive an email notification.'
      })

      // Redirect to dashboard
      navigate('/driver/dashboard')
    } catch (err) {
      console.error(err)
      toast({ title: 'Submission failed', description: 'Please check your files and try again.', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const completionPercent = getCompletionPercentage()

  // Multi-language support
  const [lang, setLang] = useState<'en' | 'ta' | 'si'>('en')

  const t = {
    en: {
      badge: 'Join Our Driver Network',
      title: 'Become a',
      titleHighlight: 'Verified Partner',
      subtitle: "Join Sri Lanka's premier travel platform. Get verified, receive bookings, and earn with flexibility.",
      avgRating: 'Avg Rating',
      activeDrivers: 'Active Drivers',
      approvalTime: 'Approval Time',
      verifiedPartners: 'Verified Partners',
      step1: 'Profile',
      step1Desc: 'Personal & vehicle info',
      step2: 'Documents',
      step2Desc: 'Upload required docs',
      step3: 'Live Capture',
      step3Desc: 'Photos & verification',
      step4: 'Review',
      step4Desc: 'Confirm & submit',
      next: 'Next Step',
      back: 'Back',
      submit: 'Submit Application',
      selectRole: 'Select Your Role / Tier'
    },
    ta: {
      badge: 'எங்கள் ஓட்டுநர் வலையமைப்பில் சேரவும்',
      title: 'ஒரு',
      titleHighlight: 'சரிபார்க்கப்பட்ட கூட்டாளி ஆகுங்கள்',
      subtitle: 'இலங்கையின் முதன்மை பயண தளத்தில் சேரவும். சரிபார்க்கப்படுங்கள், முன்பதிவுகளைப் பெறுங்கள், நெகிழ்வுத்தன்மையுடன் சம்பாதிக்கவும்.',
      avgRating: 'சராசரி மதிப்பீடு',
      activeDrivers: 'செயலில் உள்ள ஓட்டுநர்கள்',
      approvalTime: 'அங்கீகார நேரம்',
      verifiedPartners: 'சரிபார்க்கப்பட்ட கூட்டாளிகள்',
      step1: 'சுயவிவரம்',
      step1Desc: 'தனிப்பட்ட & வாகன தகவல்',
      step2: 'ஆவணங்கள்',
      step2Desc: 'தேவையான ஆவணங்களை பதிவேற்றவும்',
      step3: 'நேரடி படப்பிடிப்பு',
      step3Desc: 'புகைப்படங்கள் & சரிபார்ப்பு',
      step4: 'மதிப்பாய்வு',
      step4Desc: 'உறுதிசெய்து சமர்ப்பிக்கவும்',
      next: 'அடுத்த படி',
      back: 'பின்செல்',
      submit: 'விண்ணப்பத்தை சமர்ப்பிக்கவும்',
      selectRole: 'உங்கள் பங்கு / நிலையைத் தேர்ந்தெடுக்கவும்'
    },
    si: {
      badge: 'අපගේ රියදුරු ජාලයට එක්වන්න',
      title: 'සත්‍යාපිත',
      titleHighlight: 'හවුල්කරුවෙකු වන්න',
      subtitle: 'ශ්‍රී ලංකාවේ ප්‍රමුඛ සංචාරක වේදිකාවට එක්වන්න. සත්‍යාපිත වන්න, වෙන්කිරීම් ලබාගන්න, නම්‍යශීලීව උපයන්න.',
      avgRating: 'සාමාන්‍ය ශ්‍රේණිගත කිරීම',
      activeDrivers: 'සක්‍රීය රියදුරන්',
      approvalTime: 'අනුමත කාලය',
      verifiedPartners: 'සත්‍යාපිත හවුල්කරුවන්',
      step1: 'පැතිකඩ',
      step1Desc: 'පුද්ගලික සහ වාහන තොරතුරු',
      step2: 'ලේඛන',
      step2Desc: 'අවශ්‍ය ලේඛන උඩුගත කරන්න',
      step3: 'සජීවී ග්‍රහණය',
      step3Desc: 'ඡායාරූප සහ සත්‍යාපනය',
      step4: 'සමාලෝචනය',
      step4Desc: 'තහවුරු කර ඉදිරිපත් කරන්න',
      next: 'ඊළඟ පියවර',
      back: 'ආපසු',
      submit: 'අයදුම්පත ඉදිරිපත් කරන්න',
      selectRole: 'ඔබේ කාර්යභාරය / ශ්‍රේණිය තෝරන්න'
    }
  }

  const text = t[lang]

  return (
    <div className="bg-gradient-to-br from-amber-50 via-white to-cyan-50 min-h-screen">
      <Helmet>
        <title>Join With Us | Driver & Guide Onboarding | Recharge Travels</title>
        <meta name="description" content="Become a verified driver or guide with Recharge Travels. Secure onboarding with live capture, SLTDA compliance, and manual admin approval." />
      </Helmet>

      {/* Fixed spacing for navbar */}
      <div className="pt-20 md:pt-24">
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">

          {/* Language Switcher */}
          <div className="flex justify-center gap-2 mb-6">
            <button
              onClick={() => setLang('en')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${lang === 'en' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border'
                }`}
            >
              🇬🇧 English
            </button>
            <button
              onClick={() => setLang('ta')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${lang === 'ta' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border'
                }`}
            >
              🇱🇰 தமிழ்
            </button>
            <button
              onClick={() => setLang('si')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${lang === 'si' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border'
                }`}
            >
              🇱🇰 සිංහල
            </button>
          </div>

          {/* Hero Section - Enhanced */}
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 px-5 py-3 bg-orange-100 text-orange-700 rounded-full text-base font-semibold mb-5">
              <Car className="w-5 h-5" />
              {text.badge}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              {text.title} <span className="text-orange-600">{text.titleHighlight}</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {text.subtitle}
            </p>
          </div>

          {/* Stats Bar - Larger */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { icon: Star, label: text.avgRating, value: '4.9/5' },
              { icon: User, label: text.activeDrivers, value: '500+' },
              { icon: Clock, label: text.approvalTime, value: '24-48h' },
              { icon: BadgeCheck, label: text.verifiedPartners, value: '100%' }
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 text-center hover:shadow-lg transition-shadow">
                <stat.icon className="w-8 h-8 mx-auto text-orange-500 mb-3" />
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Progress Steps */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-6 overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {steps.map((s, i) => (
                    <React.Fragment key={s.id}>
                      <button
                        onClick={() => s.id < step && setStep(s.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${step === s.id
                          ? 'bg-orange-100 text-orange-700'
                          : step > s.id
                            ? 'bg-green-100 text-green-700 cursor-pointer hover:bg-green-200'
                            : 'bg-gray-100 text-gray-400'
                          }`}
                        disabled={s.id > step}
                      >
                        {step > s.id ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <s.icon className="w-5 h-5" />
                        )}
                        <span className="hidden md:inline font-medium">{s.title}</span>
                      </button>
                      {i < steps.length - 1 && (
                        <ChevronRight className="w-4 h-4 text-gray-300 hidden md:block" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium text-gray-600">{completionPercent}%</div>
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500"
                      style={{ width: `${completionPercent}%` }}
                    />
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Step {step}:</span> {steps[step - 1].description}
              </p>
            </div>

            {/* Form Content */}
            <div className="p-4 md:p-6">
              {/* Errors Display */}
              {Object.keys(errors).length > 0 && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-800">Please fix the following errors:</p>
                      <ul className="list-disc list-inside text-sm text-red-600 mt-1">
                        {Object.values(errors).map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: Profile */}
              {step === 1 && (
                <div className="space-y-6">
                  {/* Tier Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Select Your Role / Tier</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(Object.keys(tierInfo) as DriverTier[]).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTier(t)}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${tier === t
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/50'
                            }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">{tierInfo[t].icon}</span>
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">{tierInfo[t].label}</p>
                              <p className="text-xs text-gray-500 mb-2">{tierInfo[t].description}</p>
                              <div className="flex flex-wrap gap-1">
                                {tierInfo[t].benefits.slice(0, 3).map((b, i) => (
                                  <span key={i} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                                    {b}
                                  </span>
                                ))}
                              </div>
                            </div>
                            {tier === t && (
                              <Check className="w-5 h-5 text-orange-500" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-orange-500" />
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="As per ID / license"
                          className={errors.fullName ? 'border-red-500' : ''}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <Phone className="w-4 h-4 inline mr-1" />
                          Phone <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+94 7X XXX XXXX"
                          className={errors.phone ? 'border-red-500' : ''}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <Mail className="w-4 h-4 inline mr-1" />
                          Email <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          type="email"
                          className={errors.email ? 'border-red-500' : ''}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp (if different)</label>
                        <Input
                          value={whatsapp}
                          onChange={(e) => setWhatsapp(e.target.value)}
                          placeholder="+94 7X XXX XXXX"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <MapPin className="w-4 h-4 inline mr-1" />
                          Address
                        </label>
                        <Input
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Your address"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <Input
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Languages Spoken</label>
                        <Input
                          value={languages}
                          onChange={(e) => setLanguages(e.target.value)}
                          placeholder="English, Sinhala, Tamil"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                        <Input
                          type="number"
                          min={0}
                          value={experience}
                          onChange={(e) => setExperience(Number(e.target.value))}
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Short Bio / Introduction</label>
                      <Textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell tourists about yourself, your experience, specialties..."
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Vehicle Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Car className="w-5 h-5 text-orange-500" />
                      Vehicle Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                        <select
                          id="vehicleType"
                          title="Select vehicle type"
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white"
                          value={vehicle.type}
                          onChange={(e) => setVehicle({ ...vehicle, type: e.target.value })}
                        >
                          <option value="sedan">Sedan</option>
                          <option value="suv">SUV</option>
                          <option value="van">Van</option>
                          <option value="mini_coach">Mini Coach</option>
                          <option value="luxury">Luxury</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Registration Number <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={vehicle.registration}
                          onChange={(e) => setVehicle({ ...vehicle, registration: e.target.value })}
                          placeholder="XX-1234"
                          className={errors.vehicleReg ? 'border-red-500' : ''}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Make / Model / Year <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={vehicle.makeModelYear}
                          onChange={(e) => setVehicle({ ...vehicle, makeModelYear: e.target.value })}
                          placeholder="Toyota KDH 2018"
                          className={errors.vehicleMake ? 'border-red-500' : ''}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Seat Capacity</label>
                        <Input
                          type="number"
                          min={2}
                          value={vehicle.seats}
                          onChange={(e) => setVehicle({ ...vehicle, seats: Number(e.target.value) })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Color</label>
                        <Input
                          value={vehicle.color}
                          onChange={(e) => setVehicle({ ...vehicle, color: e.target.value })}
                          placeholder="White / Silver"
                        />
                      </div>
                      <div className="flex items-center gap-6 pt-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={vehicle.ac}
                            onChange={(e) => setVehicle({ ...vehicle, ac: e.target.checked })}
                            className="w-4 h-4 text-orange-500 rounded"
                          />
                          <span className="text-sm">Air Conditioning</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={vehicle.wifi}
                            onChange={(e) => setVehicle({ ...vehicle, wifi: e.target.checked })}
                            className="w-4 h-4 text-orange-500 rounded"
                          />
                          <span className="text-sm">WiFi Available</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* License & Rates */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-orange-500" />
                      Licenses & Rates
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          SLTDA License No. {(tier === 'chauffeur_guide' || tier === 'national_guide') && <span className="text-red-500">*</span>}
                        </label>
                        <Input
                          value={sltdaNumber}
                          onChange={(e) => setSltdaNumber(e.target.value)}
                          placeholder="C-XXXX / N-XXXX"
                          className={errors.sltda ? 'border-red-500' : ''}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">SLTDA License Expiry</label>
                        <Input
                          type="date"
                          value={sltdaExpiry}
                          onChange={(e) => setSltdaExpiry(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Police Clearance Expiry</label>
                        <Input
                          type="date"
                          value={policeExpiry}
                          onChange={(e) => setPoliceExpiry(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Medical Report Expiry</label>
                        <Input
                          type="date"
                          value={medicalExpiry}
                          onChange={(e) => setMedicalExpiry(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate (LKR)</label>
                        <Input
                          type="number"
                          min={0}
                          value={hourlyRate}
                          onChange={(e) => setHourlyRate(Number(e.target.value))}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Daily Rate (LKR)</label>
                        <Input
                          type="number"
                          min={0}
                          value={dailyRate}
                          onChange={(e) => setDailyRate(Number(e.target.value))}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Phone className="w-5 h-5 text-orange-500" />
                      Emergency Contact
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                        <Input
                          value={emergencyName}
                          onChange={(e) => setEmergencyName(e.target.value)}
                          placeholder="Emergency contact name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                        <Input
                          value={emergencyPhone}
                          onChange={(e) => setEmergencyPhone(e.target.value)}
                          placeholder="+94 7X XXX XXXX"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                        <Input
                          value={emergencyRelation}
                          onChange={(e) => setEmergencyRelation(e.target.value)}
                          placeholder="Spouse, Parent, etc."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bank Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-orange-500" />
                      Bank Details (for payments)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <Building className="w-4 h-4 inline mr-1" />
                          Bank Name
                        </label>
                        <Input
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          placeholder="Bank of Ceylon, Commercial Bank, etc."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                        <Input
                          value={bankAccount}
                          onChange={(e) => setBankAccount(e.target.value)}
                          placeholder="XXXX XXXX XXXX"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                        <Input
                          value={bankBranch}
                          onChange={(e) => setBankBranch(e.target.value)}
                          placeholder="Branch name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
                        <Input
                          value={accountHolder}
                          onChange={(e) => setAccountHolder(e.target.value)}
                          placeholder="Name as per bank account"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Social Media */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media (Optional)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Instagram Handle</label>
                        <Input
                          value={socialInsta}
                          onChange={(e) => setSocialInsta(e.target.value)}
                          placeholder="@your_handle"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Facebook Page URL</label>
                        <Input
                          value={socialFacebook}
                          onChange={(e) => setSocialFacebook(e.target.value)}
                          placeholder="https://facebook.com/..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Documents */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Upload className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-amber-800">Document Upload Guidelines</p>
                        <ul className="text-sm text-amber-700 mt-1 list-disc list-inside">
                          <li>Upload clear, readable copies of all documents</li>
                          <li>Accepted formats: JPG, PNG, PDF (max 10MB each)</li>
                          <li>Ensure all text is visible and not blurred</li>
                          <li>Documents must be valid and not expired</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {requiredDocs.map((d) => (
                      <div
                        key={d}
                        className={`border-2 rounded-xl p-4 transition-all ${docs[d]
                          ? 'border-green-400 bg-green-50'
                          : 'border-dashed border-gray-300 hover:border-orange-300 hover:bg-orange-50/50'
                          }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <label className="text-sm font-semibold text-gray-800">{prettyDoc[d]}</label>
                            <p className="text-xs text-gray-500">Required document</p>
                          </div>
                          {docs[d] && <Check className="w-5 h-5 text-green-500" />}
                        </div>
                        <label className="block">
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"
                            onChange={(e) => handleFile(setDocs, d, e.target.files)}
                            title={`Upload ${prettyDoc[d]}`}
                          />
                        </label>
                        {docs[d] && (
                          <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            {docs[d]?.name}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">Documents Uploaded</p>
                      <p className="text-sm text-gray-600">
                        {Object.values(docs).filter(Boolean).length} of {requiredDocs.length} required
                      </p>
                    </div>
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 transition-all duration-300"
                        style={{ width: `${(Object.values(docs).filter(Boolean).length / requiredDocs.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Live Capture */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Camera className="w-5 h-5 text-cyan-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-cyan-800">Live Capture Verification</p>
                        <ul className="text-sm text-cyan-700 mt-1 list-disc list-inside">
                          <li>Use a well-lit environment for clear photos</li>
                          <li>Selfie: Hold your ID next to your face</li>
                          <li>Vehicle photos: Capture all angles clearly</li>
                          <li>Video: 10-15 second introduction</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Selfie with ID */}
                    <div className={`border-2 rounded-xl p-4 ${photos['selfie_with_id'] ? 'border-green-400 bg-green-50' : 'border-dashed border-cyan-300 bg-cyan-50/50'}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-800">Selfie with ID</p>
                          <p className="text-xs text-gray-500">Required - Front camera</p>
                        </div>
                        {photos['selfie_with_id'] && <Check className="w-5 h-5 text-green-500" />}
                      </div>
                      <LiveCapture
                        label="Hold ID next to face, blink/turn"
                        facingMode="user"
                        filename="selfie_with_id.jpg"
                        onCapture={(file) => setPhotos((prev) => ({ ...prev, selfie_with_id: file }))}
                      />
                      {photos['selfie_with_id'] && (
                        <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          {photos['selfie_with_id']?.name}
                        </p>
                      )}
                    </div>

                    {/* Vehicle Front */}
                    <div className={`border-2 rounded-xl p-4 ${photos['vehicle_front'] ? 'border-green-400 bg-green-50' : 'border-dashed border-cyan-300 bg-cyan-50/50'}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-800">Vehicle Front</p>
                          <p className="text-xs text-gray-500">Required - Rear camera</p>
                        </div>
                        {photos['vehicle_front'] && <Check className="w-5 h-5 text-green-500" />}
                      </div>
                      <LiveCapture
                        label="Capture front view with plate visible"
                        facingMode="environment"
                        filename="vehicle_front.jpg"
                        onCapture={(file) => setPhotos((prev) => ({ ...prev, vehicle_front: file }))}
                      />
                      {photos['vehicle_front'] && (
                        <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          {photos['vehicle_front']?.name}
                        </p>
                      )}
                    </div>

                    {/* Vehicle Side */}
                    <div className={`border-2 rounded-xl p-4 ${photos['vehicle_side'] ? 'border-green-400 bg-green-50' : 'border-dashed border-gray-300'}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-800">Vehicle Side</p>
                          <p className="text-xs text-gray-500">Optional - Full profile view</p>
                        </div>
                        {photos['vehicle_side'] && <Check className="w-5 h-5 text-green-500" />}
                      </div>
                      <LiveCapture
                        label="Capture side profile"
                        facingMode="environment"
                        filename="vehicle_side.jpg"
                        onCapture={(file) => setPhotos((prev) => ({ ...prev, vehicle_side: file }))}
                      />
                    </div>

                    {/* Vehicle Interior */}
                    <div className={`border-2 rounded-xl p-4 ${photos['vehicle_interior'] ? 'border-green-400 bg-green-50' : 'border-dashed border-gray-300'}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-800">Vehicle Interior</p>
                          <p className="text-xs text-gray-500">Optional - Show seating</p>
                        </div>
                        {photos['vehicle_interior'] && <Check className="w-5 h-5 text-green-500" />}
                      </div>
                      <LiveCapture
                        label="Capture interior view"
                        facingMode="environment"
                        filename="vehicle_interior.jpg"
                        onCapture={(file) => setPhotos((prev) => ({ ...prev, vehicle_interior: file }))}
                      />
                    </div>

                    {/* Vehicle Back */}
                    <div className={`border-2 rounded-xl p-4 ${photos['vehicle_back'] ? 'border-green-400 bg-green-50' : 'border-dashed border-gray-300'}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-800">Vehicle Back</p>
                          <p className="text-xs text-gray-500">Optional</p>
                        </div>
                        {photos['vehicle_back'] && <Check className="w-5 h-5 text-green-500" />}
                      </div>
                      <label className="block">
                        <input
                          type="file"
                          accept="image/*"
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100 cursor-pointer"
                          onChange={(e) => handleFile(setPhotos, 'vehicle_back', e.target.files)}
                          title="Upload vehicle back photo"
                        />
                      </label>
                    </div>

                    {/* Video Intro */}
                    <div className={`border-2 rounded-xl p-4 ${photos['video_intro'] ? 'border-green-400 bg-green-50' : 'border-dashed border-gray-300'}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-800">Video Introduction</p>
                          <p className="text-xs text-gray-500">Optional - 10-15 seconds</p>
                        </div>
                        {photos['video_intro'] && <Check className="w-5 h-5 text-green-500" />}
                      </div>
                      <LivenessRecorder
                        label="Record your intro"
                        onCapture={(file) => setPhotos((prev) => ({ ...prev, video_intro: file }))}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Review */}
              {step === 4 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Shield className="w-6 h-6 text-orange-500" />
                      Application Summary
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Profile Summary */}
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <User className="w-4 h-4 text-orange-500" />
                          Profile Details
                        </h4>
                        <dl className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <dt className="text-gray-500">Name:</dt>
                            <dd className="font-medium">{fullName || 'Not provided'}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-500">Tier:</dt>
                            <dd className="font-medium">{tierInfo[tier].label}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-500">Experience:</dt>
                            <dd className="font-medium">{experience} years</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-500">Languages:</dt>
                            <dd className="font-medium">{languages}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-500">Phone:</dt>
                            <dd className="font-medium">{phone || 'Not provided'}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-500">Email:</dt>
                            <dd className="font-medium text-xs">{email || 'Not provided'}</dd>
                          </div>
                        </dl>
                      </div>

                      {/* Vehicle Summary */}
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Car className="w-4 h-4 text-orange-500" />
                          Vehicle Details
                        </h4>
                        <dl className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <dt className="text-gray-500">Type:</dt>
                            <dd className="font-medium capitalize">{vehicle.type}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-500">Make/Model:</dt>
                            <dd className="font-medium">{vehicle.makeModelYear || 'Not provided'}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-500">Registration:</dt>
                            <dd className="font-medium">{vehicle.registration || 'Not provided'}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-500">Seats:</dt>
                            <dd className="font-medium">{vehicle.seats}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-500">Features:</dt>
                            <dd className="font-medium">
                              {[vehicle.ac && 'A/C', vehicle.wifi && 'WiFi'].filter(Boolean).join(', ') || 'None'}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>

                    {/* Documents & Photos Summary */}
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Documents Uploaded</span>
                          <span className={`text-lg font-bold ${Object.values(docs).filter(Boolean).length === requiredDocs.length ? 'text-green-600' : 'text-orange-600'}`}>
                            {Object.values(docs).filter(Boolean).length}/{requiredDocs.length}
                          </span>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Photos Captured</span>
                          <span className="text-lg font-bold text-green-600">
                            {Object.values(photos).filter(Boolean).length}/{livePhotoTypes.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Terms & Conditions */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="w-5 h-5 mt-0.5 text-orange-500 rounded border-gray-300"
                      />
                      <div className="text-sm text-gray-700">
                        I confirm that all information provided is accurate and I agree to the{' '}
                        <a href="/terms" className="text-orange-600 underline">Terms of Service</a>,{' '}
                        <a href="/privacy" className="text-orange-600 underline">Privacy Policy</a>, and{' '}
                        <a href="/driver-agreement" className="text-orange-600 underline">Driver Partner Agreement</a>.
                        I understand that providing false information may result in account suspension.
                      </div>
                    </label>
                  </div>

                  {/* Important Notes */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <h4 className="font-medium text-blue-800 mb-2">What happens next?</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>1. Our team will review your application within 24-48 hours</li>
                      <li>2. You'll receive email and SMS notifications about your status</li>
                      <li>3. Once verified, you can start receiving booking requests</li>
                      <li>4. Expired or unclear documents will require re-upload</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-6">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={step === 1 || loading}
                  className="gap-2"
                >
                  Back
                </Button>

                {step < 4 ? (
                  <Button
                    onClick={nextStep}
                    disabled={loading}
                    className="bg-orange-600 hover:bg-orange-700 gap-2"
                  >
                    Continue
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={submit}
                    disabled={loading || !agreedToTerms}
                    className="bg-green-600 hover:bg-green-700 gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Submit Application
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Need help? Contact us at{' '}
              <a href="mailto:info@rechargetravels.com" className="text-orange-600 underline">
                info@rechargetravels.com
              </a>{' '}
              or WhatsApp{' '}
              <a href="https://wa.me/94777721999" className="text-green-600 underline inline-flex items-center gap-1">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                +94 77 772 1999
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JoinUsDrivers
