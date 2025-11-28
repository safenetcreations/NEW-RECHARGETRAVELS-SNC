import React, { useEffect, useState } from 'react'
import { doc, getDoc, updateDoc, collection, getDocs, query, where, serverTimestamp, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { X, FileText, Camera, Clock, CheckCircle, XCircle, AlertTriangle, Eye, User, Car, Phone, Mail, MapPin, Calendar, Shield, CreditCard, History } from 'lucide-react'

type Props = {
  driverId: string
  onClose: () => void
  onPreview?: (url: string, title: string) => void
}

const prettyDoc: Record<string, string> = {
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

const prettyPhoto: Record<string, string> = {
  selfie_with_id: 'Selfie with ID',
  vehicle_front: 'Vehicle Front',
  vehicle_back: 'Vehicle Back',
  vehicle_side: 'Vehicle Side',
  vehicle_interior: 'Vehicle Interior',
  video_intro: 'Video Introduction'
}

const tierLabels: Record<string, string> = {
  chauffeur_guide: 'Chauffeur Tourist Guide (SLTDA)',
  national_guide: 'National Tourist Guide',
  tourist_driver: 'SLITHM Tourist Driver',
  freelance_driver: 'Freelance Driver'
}

type HistoryItem = {
  id: string
  status: string
  previous_status?: string
  changed_by?: string
  notes?: string
  verification_level?: number
  created_at?: any
}

const DriverVerificationDetail: React.FC<Props> = ({ driverId, onClose, onPreview }) => {
  const [driver, setDriver] = useState<any>(null)
  const [docs, setDocs] = useState<any[]>([])
  const [photos, setPhotos] = useState<any[]>([])
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [activeTab, setActiveTab] = useState('profile')

  const load = async () => {
    const dSnap = await getDoc(doc(db, 'drivers', driverId))
    if (dSnap.exists()) setDriver({ id: dSnap.id, ...dSnap.data() })

    const dDocs = await getDocs(query(collection(db, 'driver_documents'), where('driver_id', '==', driverId)))
    setDocs(dDocs.docs.map((d) => ({ id: d.id, ...d.data() })))

    const dPhotos = await getDocs(query(collection(db, 'driver_photos'), where('driver_id', '==', driverId)))
    setPhotos(dPhotos.docs.map((d) => ({ id: d.id, ...d.data() })))

    // Load application history
    try {
      const historySnap = await getDocs(
        query(collection(db, 'driver_application_history'), where('driver_id', '==', driverId), orderBy('created_at', 'desc'))
      )
      setHistory(historySnap.docs.map((d) => ({ id: d.id, ...d.data() } as HistoryItem)))
    } catch (e) {
      console.log('No history collection or index not ready')
    }
  }

  useEffect(() => {
    load()
  }, [driverId])

  const updateItem = async (path: string, itemId: string, status: 'approved' | 'rejected', fieldName: string) => {
    await updateDoc(doc(db, path, itemId), {
      verification_status: status,
      verification_date: serverTimestamp()
    })
    toast.success(`${fieldName} ${status}`)
    load()
  }

  if (!driver) return <div className="p-4">Loading…</div>

  const expiring = (date?: string) => {
    if (!date) return false
    const dt = new Date(date)
    const now = new Date()
    const diff = (dt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    return diff < 30 && diff > 0
  }

  const expired = (date?: string) => {
    if (!date) return false
    return new Date(date) < new Date()
  }

  const formatDate = (date?: any) => {
    if (!date) return '—'
    const d = date?.toDate ? date.toDate() : new Date(date)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const handlePreview = (url: string, title: string) => {
    if (onPreview) {
      onPreview(url, title)
    } else {
      window.open(url, '_blank')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'suspended':
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'pending_verification':
        return <Clock className="w-4 h-4 text-amber-500" />
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <Card className="border-2 border-orange-200 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {/* Profile Photo */}
            <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden flex-shrink-0 border-2 border-orange-300">
              {driver.profile_photo ? (
                <img
                  src={driver.profile_photo}
                  alt={driver.full_name}
                  className="w-full h-full object-cover cursor-pointer hover:opacity-90"
                  onClick={() => handlePreview(driver.profile_photo, 'Profile Photo')}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <User className="w-8 h-8" />
                </div>
              )}
            </div>

            <div>
              <CardTitle className="text-xl">{driver.full_name || 'Driver'}</CardTitle>
              <div className="flex flex-wrap gap-2 text-xs mt-2">
                <Badge variant="outline">{tierLabels[driver.tier] || driver.tier?.replace(/_/g, ' ')}</Badge>
                <Badge variant="secondary">Level {driver.verified_level || 1}</Badge>
                <Badge variant={driver.current_status === 'verified' ? 'default' : driver.current_status === 'suspended' ? 'destructive' : 'outline'}>
                  {driver.current_status?.replace(/_/g, ' ')}
                </Badge>
                {driver.is_sltda_approved && <Badge className="bg-blue-100 text-blue-700">SLTDA Verified</Badge>}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mt-2">
                <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {driver.phone || '—'}</span>
                <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {driver.email || '—'}</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="profile" className="gap-1"><User className="w-4 h-4" /> Profile</TabsTrigger>
            <TabsTrigger value="documents" className="gap-1"><FileText className="w-4 h-4" /> Docs ({docs.length})</TabsTrigger>
            <TabsTrigger value="photos" className="gap-1"><Camera className="w-4 h-4" /> Photos ({photos.length})</TabsTrigger>
            <TabsTrigger value="history" className="gap-1"><History className="w-4 h-4" /> History</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Personal Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-orange-500" /> Personal Information
                </h4>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Full Name:</dt>
                    <dd className="font-medium">{driver.full_name || '—'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Email:</dt>
                    <dd className="font-medium">{driver.email || '—'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Phone:</dt>
                    <dd className="font-medium">{driver.phone || '—'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">WhatsApp:</dt>
                    <dd className="font-medium">{driver.whatsapp || driver.phone || '—'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Address:</dt>
                    <dd className="font-medium">{driver.address || '—'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">City:</dt>
                    <dd className="font-medium">{driver.city || '—'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Experience:</dt>
                    <dd className="font-medium">{driver.years_experience || 0} years</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Languages:</dt>
                    <dd className="font-medium">{driver.specialty_languages?.join(', ') || 'English'}</dd>
                  </div>
                </dl>
              </div>

              {/* Vehicle Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Car className="w-4 h-4 text-orange-500" /> Vehicle Information
                </h4>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Type:</dt>
                    <dd className="font-medium capitalize">{driver.vehicle_type || '—'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Make/Model:</dt>
                    <dd className="font-medium">{driver.vehicle_make_model || '—'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Registration:</dt>
                    <dd className="font-medium">{driver.vehicle_registration || '—'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Capacity:</dt>
                    <dd className="font-medium">{driver.vehicle_capacity || '—'} seats</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Features:</dt>
                    <dd className="font-medium">
                      {[driver.vehicle_ac && 'A/C', driver.vehicle_wifi && 'WiFi'].filter(Boolean).join(', ') || 'None'}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Licenses */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-orange-500" /> Licenses & Expiry
                </h4>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <dt className="text-gray-500">SLTDA License:</dt>
                    <dd className="font-medium">{driver.sltda_license_number || '—'}</dd>
                  </div>
                  <div className="flex justify-between items-center">
                    <dt className="text-gray-500">SLTDA Expiry:</dt>
                    <dd className={`font-medium ${expired(driver.sltda_license_expiry) ? 'text-red-600' : expiring(driver.sltda_license_expiry) ? 'text-amber-600' : ''}`}>
                      {driver.sltda_license_expiry || '—'}
                      {expired(driver.sltda_license_expiry) && ' (EXPIRED)'}
                      {expiring(driver.sltda_license_expiry) && ' (EXPIRING)'}
                    </dd>
                  </div>
                  <div className="flex justify-between items-center">
                    <dt className="text-gray-500">Police Clearance:</dt>
                    <dd className={`font-medium ${expired(driver.police_clearance_expiry) ? 'text-red-600' : expiring(driver.police_clearance_expiry) ? 'text-amber-600' : ''}`}>
                      {driver.police_clearance_expiry || '—'}
                      {expired(driver.police_clearance_expiry) && ' (EXPIRED)'}
                    </dd>
                  </div>
                  <div className="flex justify-between items-center">
                    <dt className="text-gray-500">Medical Report:</dt>
                    <dd className={`font-medium ${expired(driver.medical_report_expiry) ? 'text-red-600' : expiring(driver.medical_report_expiry) ? 'text-amber-600' : ''}`}>
                      {driver.medical_report_expiry || '—'}
                      {expired(driver.medical_report_expiry) && ' (EXPIRED)'}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Bank & Emergency */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-orange-500" /> Bank & Emergency
                </h4>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Bank:</dt>
                    <dd className="font-medium">{driver.bank_name || '—'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Account:</dt>
                    <dd className="font-medium">{driver.bank_account_number ? `****${driver.bank_account_number.slice(-4)}` : '—'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Emergency Contact:</dt>
                    <dd className="font-medium">{driver.emergency_contact_name || '—'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Emergency Phone:</dt>
                    <dd className="font-medium">{driver.emergency_contact_phone || '—'}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Bio */}
            {driver.biography && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">About</h4>
                <p className="text-sm text-gray-700">{driver.biography}</p>
              </div>
            )}
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {docs.map((d) => (
                <div key={d.id} className="border rounded-lg p-4 flex items-center justify-between bg-white hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      d.verification_status === 'approved' ? 'bg-green-100' :
                      d.verification_status === 'rejected' ? 'bg-red-100' : 'bg-amber-100'
                    }`}>
                      <FileText className={`w-5 h-5 ${
                        d.verification_status === 'approved' ? 'text-green-600' :
                        d.verification_status === 'rejected' ? 'text-red-600' : 'text-amber-600'
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{prettyDoc[d.document_type] || d.document_type}</p>
                      <div className="flex items-center gap-2 text-xs">
                        <Badge variant={d.verification_status === 'approved' ? 'default' : d.verification_status === 'rejected' ? 'destructive' : 'outline'} className="text-xs">
                          {d.verification_status || 'pending'}
                        </Badge>
                        {d.expiry_date && (
                          <span className={expired(d.expiry_date) ? 'text-red-500' : expiring(d.expiry_date) ? 'text-amber-500' : 'text-gray-500'}>
                            Exp: {d.expiry_date}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {d.file_path && (
                      <Button size="sm" variant="ghost" onClick={() => handlePreview(d.file_path, prettyDoc[d.document_type] || d.document_type)} title="View document">
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                    <Button size="sm" variant="secondary" onClick={() => updateItem('driver_documents', d.id, 'approved', 'Document')}>
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => updateItem('driver_documents', d.id, 'rejected', 'Document')}>
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {docs.length === 0 && <p className="text-sm text-gray-600 col-span-2 text-center py-8">No documents uploaded.</p>}
            </div>
          </TabsContent>

          {/* Photos Tab */}
          <TabsContent value="photos">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photos.map((p) => (
                <div key={p.id} className="border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow">
                  <div className="relative aspect-video bg-gray-100">
                    {p.photo_type === 'video_intro' ? (
                      <video src={p.file_path} controls className="w-full h-full object-cover" />
                    ) : (
                      <img
                        src={p.file_path}
                        alt={p.photo_type}
                        className="w-full h-full object-cover cursor-pointer hover:opacity-90"
                        onClick={() => handlePreview(p.file_path, prettyPhoto[p.photo_type] || p.photo_type)}
                      />
                    )}
                    <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center ${
                      p.verification_status === 'approved' ? 'bg-green-500' :
                      p.verification_status === 'rejected' ? 'bg-red-500' : 'bg-amber-500'
                    }`}>
                      {p.verification_status === 'approved' ? <CheckCircle className="w-4 h-4 text-white" /> :
                       p.verification_status === 'rejected' ? <XCircle className="w-4 h-4 text-white" /> :
                       <Clock className="w-4 h-4 text-white" />}
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium capitalize">{prettyPhoto[p.photo_type] || p.photo_type?.replace(/_/g, ' ')}</p>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="secondary" className="flex-1" onClick={() => updateItem('driver_photos', p.id, 'approved', 'Photo')}>
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive" className="flex-1" onClick={() => updateItem('driver_photos', p.id, 'rejected', 'Photo')}>
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {photos.length === 0 && <p className="text-sm text-gray-600 col-span-3 text-center py-8">No photos uploaded.</p>}
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <div className="space-y-4">
              {history.length > 0 ? (
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                  {history.map((h, i) => (
                    <div key={h.id} className="relative pl-10 pb-6">
                      <div className="absolute left-2 w-4 h-4 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center">
                        {getStatusIcon(h.status)}
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant={h.status === 'verified' ? 'default' : h.status === 'suspended' ? 'destructive' : 'outline'}>
                            {h.status?.replace(/_/g, ' ')}
                          </Badge>
                          <span className="text-xs text-gray-500">{formatDate(h.created_at)}</span>
                        </div>
                        {h.previous_status && (
                          <p className="text-xs text-gray-500 mb-1">
                            Changed from: {h.previous_status?.replace(/_/g, ' ')}
                          </p>
                        )}
                        {h.verification_level && (
                          <p className="text-xs text-gray-600 mb-1">Verification Level: {h.verification_level}</p>
                        )}
                        {h.notes && (
                          <p className="text-sm text-gray-700">{h.notes}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-2">By: {h.changed_by || 'System'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <History className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No application history yet.</p>
                  <p className="text-xs mt-1">History will be recorded when status changes occur.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default DriverVerificationDetail
