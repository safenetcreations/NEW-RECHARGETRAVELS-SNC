import React, { useEffect, useState } from 'react'
import { collection, getDocs, query, where, updateDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ShieldCheck, Ban } from 'lucide-react'
import { toast } from 'sonner'
import DriverVerificationDetail from './DriverVerificationDetail'
import DriverRiskBadge from './DriverRiskBadge'
import { scoreRisk, RiskAssessment } from '@/services/aiVerificationService'

type DriverRow = {
  id: string
  full_name?: string
  tier?: string
  phone?: string
  email?: string
  sltda_license_number?: string
  sltda_license_expiry?: string
  police_clearance_expiry?: string
  medical_report_expiry?: string
  verified_level?: number
  current_status?: string
  created_at?: string
}

const DriverVerificationQueue: React.FC = () => {
  const [drivers, setDrivers] = useState<DriverRow[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [risks, setRisks] = useState<Record<string, RiskAssessment>>({})

  const load = async () => {
    setLoading(true)
    const q = query(collection(db, 'drivers'), where('current_status', 'in', ['pending_verification', 'incomplete']))
    const snap = await getDocs(q)
    const list: DriverRow[] = snap.docs.map((d) => ({ id: d.id, ...d.data() } as DriverRow))
    setDrivers(list)
    // Simple risk scoring signals placeholder
    const riskEntries: Record<string, RiskAssessment> = {}
    for (const d of list) {
      riskEntries[d.id] = await scoreRisk([
        { name: 'has_sltda', weight: 5, value: Boolean(d.sltda_license_number) },
        { name: 'good_history', weight: 3, value: true }
      ])
    }
    setRisks(riskEntries)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const approve = async (id: string, level: number) => {
    await updateDoc(doc(db, 'drivers', id), {
      current_status: 'verified',
      verified_level: level,
      is_sltda_approved: level === 3,
      verification_date: serverTimestamp()
    })
    toast.success(`Driver approved at level ${level}`)
    load()
  }

  const reject = async (id: string) => {
    await updateDoc(doc(db, 'drivers', id), {
      current_status: 'suspended',
      rejection_reason: 'Admin rejected',
      verification_date: serverTimestamp()
    })
    toast.error('Driver suspended/rejected')
    load()
  }

  return (
    <div className="p-6 space-y-4">
      {selected && (
        <div className="mb-4">
          <DriverVerificationDetail driverId={selected} onClose={() => setSelected(null)} />
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Driver Verification Queue</h2>
          <p className="text-sm text-gray-600">Review pending drivers, set verification level, approve or reject.</p>
        </div>
        <Button variant="outline" onClick={load}>Refresh</Button>
      </div>

      {loading && <p className="text-gray-600">Loading drivers…</p>}

      <div className="grid gap-4">
        {drivers.map((d) => (
          <div key={d.id} className="bg-white shadow rounded-xl p-4 border border-gray-100">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{d.full_name || 'No Name'}</h3>
                <div className="flex flex-wrap gap-2 text-xs mt-1">
                  {d.tier && <Badge variant="outline">{d.tier.replace(/_/g, ' ')}</Badge>}
                  {d.sltda_license_number && <Badge variant="outline">SLTDA {d.sltda_license_number}</Badge>}
                  {d.verified_level && <Badge variant="secondary">Level {d.verified_level}</Badge>}
                  {d.current_status && <Badge variant="outline">{d.current_status}</Badge>}
                </div>
                <p className="text-sm text-gray-600 mt-2">Phone: {d.phone || 'N/A'} · Email: {d.email || 'N/A'}</p>
                <p className="text-xs text-gray-500">
                  SLTDA Exp: {d.sltda_license_expiry || '—'} · Police Exp: {d.police_clearance_expiry || '—'} · Medical Exp: {d.medical_report_expiry || '—'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <DriverRiskBadge assessment={risks[d.id]} />
                <Button size="sm" variant="outline" onClick={() => setSelected(d.id)}>
                  Review
                </Button>
                <Button size="sm" onClick={() => approve(d.id, 2)} className="bg-emerald-600 hover:bg-emerald-700">
                  <ShieldCheck size={16} className="mr-1" /> Approve L2
                </Button>
                <Button size="sm" onClick={() => approve(d.id, 3)} className="bg-blue-600 hover:bg-blue-700">
                  <ShieldCheck size={16} className="mr-1" /> Approve L3
                </Button>
                <Button size="sm" variant="destructive" onClick={() => reject(d.id)}>
                  <Ban size={16} className="mr-1" /> Reject
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && drivers.length === 0 && (
        <div className="text-gray-600 bg-white p-6 rounded-xl border border-dashed border-gray-200">
          No pending drivers right now.
        </div>
      )}
    </div>
  )
}

export default DriverVerificationQueue
