import React, { useEffect, useState } from 'react'
import { doc, getDoc, updateDoc, collection, getDocs, query, where, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

type Props = {
  driverId: string
  onClose: () => void
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

const DriverVerificationDetail: React.FC<Props> = ({ driverId, onClose }) => {
  const [driver, setDriver] = useState<any>(null)
  const [docs, setDocs] = useState<any[]>([])
  const [photos, setPhotos] = useState<any[]>([])

  const load = async () => {
    const dSnap = await getDoc(doc(db, 'drivers', driverId))
    if (dSnap.exists()) setDriver({ id: dSnap.id, ...dSnap.data() })
    const dDocs = await getDocs(query(collection(db, 'driver_documents'), where('driver_id', '==', driverId)))
    setDocs(dDocs.docs.map((d) => ({ id: d.id, ...d.data() })))
    const dPhotos = await getDocs(query(collection(db, 'driver_photos'), where('driver_id', '==', driverId)))
    setPhotos(dPhotos.docs.map((d) => ({ id: d.id, ...d.data() })))
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
    return diff < 30
  }

  return (
    <div className="p-4 space-y-4 bg-white rounded-xl border border-gray-200 shadow">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{driver.full_name || 'Driver'}</h3>
          <div className="flex gap-2 text-xs">
            <Badge variant="outline">{driver.tier?.replace(/_/g, ' ')}</Badge>
            <Badge variant="secondary">Level {driver.verified_level || 1}</Badge>
            <Badge variant="outline">{driver.current_status}</Badge>
          </div>
          <p className="text-xs text-gray-500">Phone: {driver.phone || '—'} · Email: {driver.email || '—'}</p>
          <p className="text-xs text-gray-500">SLTDA Exp: {driver.sltda_license_expiry || '—'} {expiring(driver.sltda_license_expiry) && <span className="text-red-500">Expiring</span>}</p>
        </div>
        <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Documents</h4>
          <div className="space-y-2">
            {docs.map((d) => (
              <div key={d.id} className="border rounded-lg p-2 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{prettyDoc[d.document_type] || d.document_type}</p>
                  <p className="text-xs text-gray-500">Status: {d.verification_status}</p>
                  {d.expiry_date && <p className={`text-xs ${expiring(d.expiry_date) ? 'text-red-500' : 'text-gray-500'}`}>Expiry: {d.expiry_date}</p>}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => updateItem('driver_documents', d.id, 'approved', 'Document')}>Approve</Button>
                  <Button size="sm" variant="destructive" onClick={() => updateItem('driver_documents', d.id, 'rejected', 'Document')}>Reject</Button>
                </div>
              </div>
            ))}
            {docs.length === 0 && <p className="text-sm text-gray-600">No documents uploaded.</p>}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Photos</h4>
          <div className="space-y-2">
            {photos.map((p) => (
              <div key={p.id} className="border rounded-lg p-2 flex items-center gap-3">
                <img src={p.file_path} alt={p.photo_type} className="w-16 h-16 object-cover rounded-md border" />
                <div className="flex-1">
                  <p className="text-sm font-medium capitalize">{p.photo_type?.replace(/_/g, ' ')}</p>
                  <p className="text-xs text-gray-500">Status: {p.verification_status}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => updateItem('driver_photos', p.id, 'approved', 'Photo')}>Approve</Button>
                  <Button size="sm" variant="destructive" onClick={() => updateItem('driver_photos', p.id, 'rejected', 'Photo')}>Reject</Button>
                </div>
              </div>
            ))}
            {photos.length === 0 && <p className="text-sm text-gray-600">No photos uploaded.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DriverVerificationDetail
