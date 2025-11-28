import React, { useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useToast } from '@/hooks/use-toast'
import { auth } from '@/lib/firebase'
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

const roleDocs: Record<DriverTier, DocumentType[]> = {
  chauffeur_guide: ['slt_da_license', 'driving_license', 'national_id', 'police_clearance', 'medical_report', 'vehicle_revenue_license', 'vehicle_insurance'],
  national_guide: ['slt_da_license', 'driving_license', 'national_id', 'police_clearance', 'medical_report'],
  tourist_driver: ['driving_license', 'national_id', 'police_clearance', 'vehicle_revenue_license', 'vehicle_insurance'],
  freelance_driver: ['driving_license', 'national_id', 'vehicle_revenue_license', 'vehicle_insurance']
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

const JoinUsDrivers: React.FC = () => {
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const [tier, setTier] = useState<DriverTier>('freelance_driver')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
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

  const [vehicle, setVehicle] = useState({
    type: 'suv',
    registration: '',
    makeModelYear: '',
    seats: 4
  })

  const [docs, setDocs] = useState<FileMap>({})
  const [photos, setPhotos] = useState<FileMap>({})

  const requiredDocs = useMemo(() => roleDocs[tier] || [], [tier])

  const handleFile = (setter: React.Dispatch<React.SetStateAction<FileMap>>, key: string, fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return
    const file = fileList[0]
    setter((prev) => ({ ...prev, [key]: file }))
  }

  const nextStep = () => setStep((s) => Math.min(s + 1, 4))
  const prevStep = () => setStep((s) => Math.max(s - 1, 1))

  const submit = async () => {
    const userId = auth?.currentUser?.uid
    if (!userId) {
      toast({ title: 'Please sign in', description: 'You need to be logged in to submit your profile.', variant: 'destructive' })
      return
    }

    setLoading(true)
    try {
      await createOrUpdateDriverProfile(userId, {
        full_name: fullName,
        email,
        phone,
        tier,
        biography: bio,
        specialty_languages: languages.split(',').map((l) => l.trim()),
        years_experience: experience,
        hourly_rate: hourlyRate || undefined,
        daily_rate: dailyRate || undefined,
        vehicle_preference: 'own_vehicle',
        sltda_license_number: sltdaNumber || undefined,
        sltda_license_expiry: sltdaExpiry || undefined,
        police_clearance_expiry: policeExpiry || undefined,
        medical_report_expiry: medicalExpiry || undefined,
        social_insta: socialInsta || undefined,
        social_facebook: socialFacebook || undefined,
        current_status: 'pending_verification',
        verified_level: 1
      })

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

      toast({ title: 'Submitted for verification', description: 'Our team will review your documents and notify you.' })
      setStep(1)
    } catch (err) {
      console.error(err)
      toast({ title: 'Submission failed', description: 'Please check files and try again.', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 via-white to-cyan-50 min-h-screen">
      <Helmet>
        <title>Join With Us | Driver & Guide Onboarding | Recharge Travels</title>
        <meta name="description" content="Become a verified driver or guide with Recharge Travels. Secure onboarding with live capture, SLTDA compliance, and manual admin approval." />
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold text-orange-600 tracking-wide uppercase">Join With Us</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2">Driver & Guide Onboarding</h1>
          <p className="text-lg text-gray-600 mt-3">Mobile-shot only capture, SLTDA-ready verification, and manual admin approval.</p>
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-6 space-y-6 border border-orange-100">
          <div className="flex items-center justify-between text-sm font-medium">
            <span className={step === 1 ? 'text-orange-600' : 'text-gray-500'}>Step 1 · Profile</span>
            <span className={step === 2 ? 'text-orange-600' : 'text-gray-500'}>Step 2 · Documents</span>
            <span className={step === 3 ? 'text-orange-600' : 'text-gray-500'}>Step 3 · Live Capture</span>
            <span className={step === 4 ? 'text-orange-600' : 'text-gray-500'}>Step 4 · Confirm</span>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">Role / Tier</label>
                <select
                  className="w-full mt-1 rounded-lg border border-gray-300 px-3 py-2"
                  value={tier}
                  onChange={(e) => setTier(e.target.value as DriverTier)}
                >
                  <option value="chauffeur_guide">Chauffeur Tourist Guide (SLTDA)</option>
                  <option value="national_guide">National Tourist Guide</option>
                  <option value="tourist_driver">SLITHM Tourist Driver</option>
                  <option value="freelance_driver">Freelance / Standard Driver</option>
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Full Name</label>
                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="As per ID / license" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Phone (OTP required)</label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+94 7X XXX XXXX" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Email</label>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Languages</label>
                  <Input value={languages} onChange={(e) => setLanguages(e.target.value)} placeholder="English, Sinhala, Tamil" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Years of Experience</label>
                  <Input type="number" min={0} value={experience} onChange={(e) => setExperience(Number(e.target.value))} />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Hourly Rate (LKR)</label>
                  <Input type="number" min={0} value={hourlyRate} onChange={(e) => setHourlyRate(Number(e.target.value))} />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Daily Rate (LKR)</label>
                  <Input type="number" min={0} value={dailyRate} onChange={(e) => setDailyRate(Number(e.target.value))} />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Short Bio</label>
                <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Professional intro for customers" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Vehicle Type</label>
                  <select
                    className="w-full mt-1 rounded-lg border border-gray-300 px-3 py-2"
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
                  <label className="text-sm font-semibold text-gray-700">Registration Number</label>
                  <Input value={vehicle.registration} onChange={(e) => setVehicle({ ...vehicle, registration: e.target.value })} placeholder="XX-1234" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Make / Model / Year</label>
                  <Input value={vehicle.makeModelYear} onChange={(e) => setVehicle({ ...vehicle, makeModelYear: e.target.value })} placeholder="Toyota KDH 2018" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Seat Capacity</label>
                  <Input type="number" min={2} value={vehicle.seats} onChange={(e) => setVehicle({ ...vehicle, seats: Number(e.target.value) })} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">SLTDA License No.</label>
                  <Input value={sltdaNumber} onChange={(e) => setSltdaNumber(e.target.value)} placeholder="C-XXXX / N-XXXX" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">SLTDA License Expiry</label>
                  <Input type="date" value={sltdaExpiry} onChange={(e) => setSltdaExpiry(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Police Clearance Expiry</label>
                  <Input type="date" value={policeExpiry} onChange={(e) => setPoliceExpiry(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Medical Report Expiry</label>
                  <Input type="date" value={medicalExpiry} onChange={(e) => setMedicalExpiry(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Instagram Handle</label>
                  <Input value={socialInsta} onChange={(e) => setSocialInsta(e.target.value)} placeholder="@driver_handle" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Facebook Page URL</label>
                  <Input value={socialFacebook} onChange={(e) => setSocialFacebook(e.target.value)} placeholder="https://facebook.com/..." />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Upload clear, live captures. Use the rear camera (capture="environment").</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {requiredDocs.map((d) => (
                  <div key={d} className="border rounded-lg p-3 border-dashed border-orange-200 bg-orange-50/50">
                    <label className="text-sm font-semibold text-gray-800">{prettyDoc[d]}</label>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      capture="environment"
                      className="mt-2 block w-full text-sm"
                      onChange={(e) => handleFile(setDocs, d, e.target.files)}
                    />
                    {docs[d] && <p className="text-xs text-green-600 mt-1">{docs[d]?.name}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Live capture only. Follow the liveness prompt, no gallery uploads.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-3 border-dashed border-cyan-200 bg-cyan-50/50">
                  <LiveCapture
                    label="Selfie with ID (front camera, blink/turn)"
                    facingMode="user"
                    filename="selfie_with_id.jpg"
                    onCapture={(file) => setPhotos((prev) => ({ ...prev, selfie_with_id: file }))}
                  />
                  {photos['selfie_with_id'] && <p className="text-xs text-green-600 mt-1">{photos['selfie_with_id']?.name}</p>}
                </div>
                <div className="border rounded-lg p-3 border-dashed border-cyan-200 bg-cyan-50/50">
                  <LiveCapture
                    label="Vehicle Front (rear camera)"
                    facingMode="environment"
                    filename="vehicle_front.jpg"
                    onCapture={(file) => setPhotos((prev) => ({ ...prev, vehicle_front: file }))}
                  />
                  {photos['vehicle_front'] && <p className="text-xs text-green-600 mt-1">{photos['vehicle_front']?.name}</p>}
                </div>
                <div className="border rounded-lg p-3 border-dashed border-cyan-200 bg-cyan-50/50">
                  <LiveCapture
                    label="Vehicle Side (rear camera)"
                    facingMode="environment"
                    filename="vehicle_side.jpg"
                    onCapture={(file) => setPhotos((prev) => ({ ...prev, vehicle_side: file }))}
                  />
                  {photos['vehicle_side'] && <p className="text-xs text-green-600 mt-1">{photos['vehicle_side']?.name}</p>}
                </div>
                <div className="border rounded-lg p-3 border-dashed border-cyan-200 bg-cyan-50/50">
                  <LiveCapture
                    label="Vehicle Interior (rear camera)"
                    facingMode="environment"
                    filename="vehicle_interior.jpg"
                    onCapture={(file) => setPhotos((prev) => ({ ...prev, vehicle_interior: file }))}
                  />
                  {photos['vehicle_interior'] && <p className="text-xs text-green-600 mt-1">{photos['vehicle_interior']?.name}</p>}
                </div>
                <div className="border rounded-lg p-3 border-dashed border-cyan-200 bg-cyan-50/50">
                  <label className="text-sm font-semibold text-gray-800">Vehicle Back (fallback file capture)</label>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="mt-2 block w-full text-sm"
                    onChange={(e) => handleFile(setPhotos, 'vehicle_back', e.target.files)}
                  />
                  {photos['vehicle_back'] && <p className="text-xs text-green-600 mt-1">{photos['vehicle_back']?.name}</p>}
                </div>
                <div className="border rounded-lg p-3 border-dashed border-cyan-200 bg-cyan-50/50">
                  <LivenessRecorder
                    label="Video Intro & Liveness"
                    onCapture={(file) => setPhotos((prev) => ({ ...prev, video_intro: file }))}
                  />
                  {photos['video_intro'] && <p className="text-xs text-green-600 mt-1">{photos['video_intro']?.name}</p>}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Review & Submit</h3>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                <li>Tier: {tier}</li>
                <li>Experience: {experience} years</li>
                <li>Languages: {languages}</li>
                <li>Vehicle: {vehicle.makeModelYear || vehicle.type} ({vehicle.seats} seats) · Reg {vehicle.registration || 'N/A'}</li>
                <li>Docs attached: {Object.values(docs).filter(Boolean).length}/{requiredDocs.length}</li>
                <li>Live captures attached: {Object.values(photos).filter(Boolean).length}/{livePhotoTypes.length}</li>
              </ul>
              <p className="text-xs text-gray-500">After submission, our admin team performs manual verification (ID match, police, SLTDA). Expired/unclear uploads will be rejected.</p>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={prevStep} disabled={step === 1 || loading}>Back</Button>
            {step < 4 && (
              <Button onClick={nextStep} disabled={loading}>Next</Button>
            )}
            {step === 4 && (
              <Button onClick={submit} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit for Verification'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default JoinUsDrivers
