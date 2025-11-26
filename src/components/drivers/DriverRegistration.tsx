
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, Upload, Camera, Video } from 'lucide-react'
import { dbService, authService, storageService } from '@/lib/firebase-services'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import LiveSelfieCapture from './LiveSelfieCapture'
import LiveVideoCapture from './LiveVideoCapture'

const driverSchema = z.object({
  first_name: z.string().min(2, 'First name is required'),
  last_name: z.string().min(2, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  whatsapp_number: z.string().min(10, 'WhatsApp number is required'),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  full_address: z.string().min(10, 'Full address is required'),
  license_number: z.string().min(5, 'License number is required'),
  experience_years: z.number().min(1).max(50),
  languages: z.array(z.string()).min(1, 'At least one language is required'),
  bio: z.string().min(50, 'Bio must be at least 50 characters')
})

type DriverFormData = z.infer<typeof driverSchema>

const DriverRegistration = () => {
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [useLiveCapture, setUseLiveCapture] = useState(true)

  const form = useForm<DriverFormData>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: user?.email || '',
      phone: '',
      whatsapp_number: '',
      date_of_birth: '',
      full_address: '',
      license_number: '',
      experience_years: 1,
      languages: ['English'],
      bio: ''
    }
  })

  const steps = [
    { title: 'Personal Information', description: 'Basic details about you' },
    { title: 'Professional Details', description: 'License and experience' },
    { title: 'Document Upload', description: 'Required documents' },
    { title: 'Profile Photo', description: 'Live selfie capture' },
    { title: 'Vehicle Video', description: 'Vehicle verification' }
  ]

  const requiredDocuments = [
    { key: 'cv', label: 'CV/Resume', required: true },
    { key: 'driving_license', label: 'Driving License', required: true },
    { key: 'tourism_board_id', label: 'Tourism Board ID', required: true },
    { key: 'police_report', label: 'Police Report', required: true },
    { key: 'character_certificate', label: 'Character Certificate', required: true }
  ]

  const handleFileUpload = (documentType: string, file: File) => {
    setUploadedFiles(prev => ({ ...prev, [documentType]: file }))
    toast.success(`${documentType} uploaded successfully`)
  }

  const handleLiveSelfieCapture = (imageBlob: Blob) => {
    const file = new File([imageBlob], 'profile-selfie.jpg', { type: 'image/jpeg' })
    handleFileUpload('profile_photo', file)
    toast.success('Live selfie captured successfully!')
  }

  const handleLiveVideoCapture = (videoBlob: Blob) => {
    const file = new File([videoBlob], 'vehicle-video.mp4', { type: 'video/mp4' })
    handleFileUpload('vehicle_video', file)
    toast.success('Vehicle video recorded successfully!')
  }

  const uploadToSupabase = async (file: File, bucket: string, path: string) => {
    const fullPath = `${bucket}/${path}`;
    const result = await storageService.upload(fullPath, file);
    return result;
  }

  const handleSubmit = async (data: DriverFormData) => {
    if (!user) {
      toast.error('Please log in to register as a driver')
      return
    }

    setIsSubmitting(true)

    try {
      // Upload documents
      const documentUrls: Record<string, string> = {}
      
      for (const [docType, file] of Object.entries(uploadedFiles)) {
        if (file) {
          const path = `${user.uid}/${docType}-${Date.now()}.${file.name.split('.').pop()}`
          await uploadToSupabase(file, 'driver-documents', path)
          documentUrls[`${docType}_url`] = path
        }
      }

      // Create driver record
      const { error } = await supabase
        .from('drivers')
        .insert({
          ...data,
          ...documentUrls,
          languages: data.languages,
          overall_verification_status: 'pending'
        })

      if (error) throw error

      toast.success('Driver registration submitted successfully!')
      // Redirect to dashboard or confirmation page
      
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('Failed to submit registration. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const progress = (currentStep / steps.length) * 100

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Driver Registration</CardTitle>
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-600 text-center">
              Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">First Name *</Label>
                    <Input {...form.register('first_name')} />
                    {form.formState.errors.first_name && (
                      <p className="text-sm text-red-500">{form.formState.errors.first_name.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name *</Label>
                    <Input {...form.register('last_name')} />
                    {form.formState.errors.last_name && (
                      <p className="text-sm text-red-500">{form.formState.errors.last_name.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input type="email" {...form.register('email')} />
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input {...form.register('phone')} placeholder="+94 77 123 4567" />
                    {form.formState.errors.phone && (
                      <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="whatsapp_number">WhatsApp Number *</Label>
                    <Input {...form.register('whatsapp_number')} placeholder="+94 77 123 4567" />
                    {form.formState.errors.whatsapp_number && (
                      <p className="text-sm text-red-500">{form.formState.errors.whatsapp_number.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="date_of_birth">Date of Birth *</Label>
                  <Input type="date" {...form.register('date_of_birth')} />
                  {form.formState.errors.date_of_birth && (
                    <p className="text-sm text-red-500">{form.formState.errors.date_of_birth.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="full_address">Full Address *</Label>
                  <Textarea {...form.register('full_address')} rows={3} />
                  {form.formState.errors.full_address && (
                    <p className="text-sm text-red-500">{form.formState.errors.full_address.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Professional Details */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Professional Details</h3>
                
                <div>
                  <Label htmlFor="license_number">Driving License Number *</Label>
                  <Input {...form.register('license_number')} />
                  {form.formState.errors.license_number && (
                    <p className="text-sm text-red-500">{form.formState.errors.license_number.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="experience_years">Years of Experience *</Label>
                  <Input 
                    type="number" 
                    min="1" 
                    max="50"
                    {...form.register('experience_years', { valueAsNumber: true })} 
                  />
                  {form.formState.errors.experience_years && (
                    <p className="text-sm text-red-500">{form.formState.errors.experience_years.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="bio">Bio (Describe your experience and specializations) *</Label>
                  <Textarea 
                    {...form.register('bio')} 
                    rows={4}
                    placeholder="Tell customers about your experience, specializations, and what makes you a great driver..."
                  />
                  {form.formState.errors.bio && (
                    <p className="text-sm text-red-500">{form.formState.errors.bio.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Document Upload */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Required Documents</h3>
                <p className="text-sm text-gray-600">
                  Please upload clear, high-quality images of the following documents:
                </p>
                
                {requiredDocuments.map((doc) => (
                  <div key={doc.key} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Label>{doc.label} {doc.required && '*'}</Label>
                      {uploadedFiles[doc.key] && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                    <Input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload(doc.key, file)
                      }}
                    />
                    {uploadedFiles[doc.key] && (
                      <p className="text-sm text-green-600 mt-1">
                        ✓ {uploadedFiles[doc.key].name}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Step 4: Enhanced Profile Photo */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Profile Photo</h3>
                
                {useLiveCapture ? (
                  <LiveSelfieCapture
                    onCapture={handleLiveSelfieCapture}
                    onSkip={() => setUseLiveCapture(false)}
                  />
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Upload a clear, professional photo for your driver profile
                    </p>
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Upload className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleFileUpload('profile_photo', file)
                        }}
                      />
                      {uploadedFiles.profile_photo && (
                        <p className="text-sm text-green-600 mt-2">
                          ✓ {uploadedFiles.profile_photo.name}
                        </p>
                      )}
                    </div>
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setUseLiveCapture(true)}
                      className="w-full"
                    >
                      Use Live Camera Instead
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Enhanced Vehicle Video */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Vehicle Verification</h3>
                
                {useLiveCapture ? (
                  <LiveVideoCapture
                    onCapture={handleLiveVideoCapture}
                    onSkip={() => setUseLiveCapture(false)}
                  />
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Upload a video showing your vehicle inside and outside
                    </p>
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Upload className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                      <Input
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleFileUpload('vehicle_video', file)
                        }}
                      />
                      {uploadedFiles.vehicle_video && (
                        <p className="text-sm text-green-600 mt-2">
                          ✓ {uploadedFiles.vehicle_video.name}
                        </p>
                      )}
                    </div>
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setUseLiveCapture(true)}
                      className="w-full"
                    >
                      Use Live Camera Instead
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              {currentStep < steps.length ? (
                <Button type="button" onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-teal-green hover:bg-teal-700"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default DriverRegistration
