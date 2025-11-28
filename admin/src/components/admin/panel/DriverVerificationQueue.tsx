import React, { useEffect, useState } from 'react'
import { collection, getDocs, query, where, updateDoc, doc, serverTimestamp, orderBy, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ShieldCheck, Ban, RefreshCw, Search, Users, Clock, AlertTriangle, CheckCircle, Eye, Mail, FileText, Car, Calendar, ChevronRight, X, ZoomIn, ZoomOut, RotateCw } from 'lucide-react'
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
  vehicle_make_model?: string
  years_experience?: number
  profile_photo?: string
  application_submitted_at?: string
}

type DriverStats = {
  total: number
  pending: number
  verified: number
  suspended: number
  incomplete: number
}

const tierLabels: Record<string, string> = {
  chauffeur_guide: 'Chauffeur Guide',
  national_guide: 'National Guide',
  tourist_driver: 'Tourist Driver',
  freelance_driver: 'Freelance Driver'
}

const DriverVerificationQueue: React.FC = () => {
  const [drivers, setDrivers] = useState<DriverRow[]>([])
  const [allDrivers, setAllDrivers] = useState<DriverRow[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [risks, setRisks] = useState<Record<string, RiskAssessment>>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [stats, setStats] = useState<DriverStats>({ total: 0, pending: 0, verified: 0, suspended: 0, incomplete: 0 })
  const [activeTab, setActiveTab] = useState<'pending' | 'verified' | 'suspended' | 'all'>('pending')

  // Approval/Rejection Dialog
  const [actionDialog, setActionDialog] = useState<{ open: boolean; driverId: string; action: 'approve' | 'reject' | null; level: number }>({
    open: false,
    driverId: '',
    action: null,
    level: 2
  })
  const [actionNotes, setActionNotes] = useState('')
  const [processing, setProcessing] = useState(false)

  // Document Preview Modal
  const [previewModal, setPreviewModal] = useState<{ open: boolean; url: string; title: string }>({ open: false, url: '', title: '' })
  const [zoomLevel, setZoomLevel] = useState(1)
  const [rotation, setRotation] = useState(0)

  const load = async () => {
    setLoading(true)
    try {
      // Load all drivers for stats
      const allSnap = await getDocs(query(collection(db, 'drivers'), orderBy('created_at', 'desc')))
      const allList: DriverRow[] = allSnap.docs.map((d) => ({ id: d.id, ...d.data() } as DriverRow))
      setAllDrivers(allList)

      // Calculate stats
      const newStats: DriverStats = {
        total: allList.length,
        pending: allList.filter(d => d.current_status === 'pending_verification').length,
        verified: allList.filter(d => d.current_status === 'verified').length,
        suspended: allList.filter(d => d.current_status === 'suspended').length,
        incomplete: allList.filter(d => d.current_status === 'incomplete').length
      }
      setStats(newStats)

      // Load pending drivers with risk assessment
      const q = query(collection(db, 'drivers'), where('current_status', 'in', ['pending_verification', 'incomplete']), orderBy('created_at', 'desc'))
      const snap = await getDocs(q)
      const list: DriverRow[] = snap.docs.map((d) => ({ id: d.id, ...d.data() } as DriverRow))
      setDrivers(list)

      // Risk scoring
      const riskEntries: Record<string, RiskAssessment> = {}
      for (const d of list) {
        riskEntries[d.id] = await scoreRisk([
          { name: 'has_sltda', weight: 5, value: Boolean(d.sltda_license_number) },
          { name: 'good_history', weight: 3, value: true },
          { name: 'has_experience', weight: 2, value: (d.years_experience || 0) >= 2 }
        ])
      }
      setRisks(riskEntries)
    } catch (error) {
      console.error('Error loading drivers:', error)
      toast.error('Failed to load drivers')
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const getFilteredDrivers = () => {
    let filtered = activeTab === 'pending' ? drivers : allDrivers

    if (activeTab === 'verified') {
      filtered = allDrivers.filter(d => d.current_status === 'verified')
    } else if (activeTab === 'suspended') {
      filtered = allDrivers.filter(d => d.current_status === 'suspended' || d.current_status === 'inactive')
    } else if (activeTab === 'all') {
      filtered = allDrivers
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(d =>
        d.full_name?.toLowerCase().includes(term) ||
        d.email?.toLowerCase().includes(term) ||
        d.phone?.includes(term) ||
        d.sltda_license_number?.toLowerCase().includes(term)
      )
    }

    return filtered
  }

  const openApproveDialog = (driverId: string, level: number) => {
    setActionDialog({ open: true, driverId, action: 'approve', level })
    setActionNotes('')
  }

  const openRejectDialog = (driverId: string) => {
    setActionDialog({ open: true, driverId, action: 'reject', level: 0 })
    setActionNotes('')
  }

  const handleAction = async () => {
    if (!actionDialog.driverId) return

    setProcessing(true)
    try {
      if (actionDialog.action === 'approve') {
        await updateDoc(doc(db, 'drivers', actionDialog.driverId), {
          current_status: 'verified',
          verified_level: actionDialog.level,
          is_sltda_approved: actionDialog.level === 3,
          verification_date: serverTimestamp(),
          verification_notes: actionNotes || undefined,
          updated_at: serverTimestamp()
        })
        toast.success(`Driver approved at Level ${actionDialog.level}`)
      } else if (actionDialog.action === 'reject') {
        if (!actionNotes.trim()) {
          toast.error('Please provide a rejection reason')
          setProcessing(false)
          return
        }
        await updateDoc(doc(db, 'drivers', actionDialog.driverId), {
          current_status: 'suspended',
          rejection_reason: actionNotes,
          verification_date: serverTimestamp(),
          updated_at: serverTimestamp()
        })
        toast.error('Driver application rejected')
      }

      setActionDialog({ open: false, driverId: '', action: null, level: 2 })
      setActionNotes('')
      load()
    } catch (error) {
      console.error('Error processing action:', error)
      toast.error('Failed to process action')
    }
    setProcessing(false)
  }

  const openPreview = (url: string, title: string) => {
    setPreviewModal({ open: true, url, title })
    setZoomLevel(1)
    setRotation(0)
  }

  const formatDate = (date?: string) => {
    if (!date) return '—'
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const isExpiringSoon = (date?: string) => {
    if (!date) return false
    const expiry = new Date(date)
    const now = new Date()
    const diff = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    return diff < 30 && diff > 0
  }

  const isExpired = (date?: string) => {
    if (!date) return false
    return new Date(date) < new Date()
  }

  const filteredDrivers = getFilteredDrivers()

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('all')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Drivers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className={`cursor-pointer hover:shadow-md transition-shadow ${activeTab === 'pending' ? 'ring-2 ring-amber-500' : ''}`} onClick={() => setActiveTab('pending')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Review</p>
                <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-amber-400" />
            </div>
          </CardContent>
        </Card>

        <Card className={`cursor-pointer hover:shadow-md transition-shadow ${activeTab === 'verified' ? 'ring-2 ring-green-500' : ''}`} onClick={() => setActiveTab('verified')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Verified</p>
                <p className="text-2xl font-bold text-green-600">{stats.verified}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className={`cursor-pointer hover:shadow-md transition-shadow ${activeTab === 'suspended' ? 'ring-2 ring-red-500' : ''}`} onClick={() => setActiveTab('suspended')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Suspended</p>
                <p className="text-2xl font-bold text-red-600">{stats.suspended}</p>
              </div>
              <Ban className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Incomplete</p>
                <p className="text-2xl font-bold text-gray-500">{stats.incomplete}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Driver Detail Panel */}
      {selected && (
        <div className="mb-4">
          <DriverVerificationDetail driverId={selected} onClose={() => setSelected(null)} onPreview={openPreview} />
        </div>
      )}

      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Driver Verification Queue</h2>
          <p className="text-sm text-gray-600">
            {activeTab === 'pending' ? 'Review pending applications' : activeTab === 'verified' ? 'Verified drivers' : activeTab === 'suspended' ? 'Suspended/Rejected' : 'All drivers'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by name, email, phone, SLTDA..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline" onClick={load} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList>
          <TabsTrigger value="pending" className="gap-2">
            <Clock className="w-4 h-4" /> Pending ({stats.pending})
          </TabsTrigger>
          <TabsTrigger value="verified" className="gap-2">
            <CheckCircle className="w-4 h-4" /> Verified ({stats.verified})
          </TabsTrigger>
          <TabsTrigger value="suspended" className="gap-2">
            <Ban className="w-4 h-4" /> Suspended ({stats.suspended})
          </TabsTrigger>
          <TabsTrigger value="all" className="gap-2">
            <Users className="w-4 h-4" /> All ({stats.total})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {loading && <p className="text-gray-600 py-4">Loading drivers…</p>}

          <div className="grid gap-4">
            {filteredDrivers.map((d) => (
              <Card key={d.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {/* Profile Photo */}
                      <div className="w-14 h-14 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                        {d.profile_photo ? (
                          <img src={d.profile_photo} alt={d.full_name} className="w-full h-full object-cover cursor-pointer" onClick={() => openPreview(d.profile_photo!, 'Profile Photo')} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Users className="w-6 h-6" />
                          </div>
                        )}
                      </div>

                      {/* Driver Info */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{d.full_name || 'No Name'}</h3>
                        <div className="flex flex-wrap gap-2 text-xs mt-1">
                          {d.tier && <Badge variant="outline">{tierLabels[d.tier] || d.tier}</Badge>}
                          {d.sltda_license_number && <Badge variant="secondary">SLTDA {d.sltda_license_number}</Badge>}
                          {d.verified_level && d.current_status === 'verified' && (
                            <Badge className="bg-green-100 text-green-700">Level {d.verified_level}</Badge>
                          )}
                          <Badge variant={d.current_status === 'verified' ? 'default' : d.current_status === 'suspended' ? 'destructive' : 'outline'}>
                            {d.current_status?.replace(/_/g, ' ')}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mt-2">
                          <span>{d.phone || 'No phone'}</span>
                          <span>{d.email || 'No email'}</span>
                          {d.vehicle_make_model && (
                            <span className="flex items-center gap-1">
                              <Car className="w-3 h-3" /> {d.vehicle_make_model}
                            </span>
                          )}
                        </div>
                        {/* Expiry Warnings */}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {d.sltda_license_expiry && (
                            <span className={`text-xs flex items-center gap-1 ${isExpired(d.sltda_license_expiry) ? 'text-red-600' : isExpiringSoon(d.sltda_license_expiry) ? 'text-amber-600' : 'text-gray-500'}`}>
                              <Calendar className="w-3 h-3" />
                              SLTDA: {formatDate(d.sltda_license_expiry)}
                              {isExpired(d.sltda_license_expiry) && ' (EXPIRED)'}
                              {isExpiringSoon(d.sltda_license_expiry) && ' (EXPIRING)'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {activeTab === 'pending' && <DriverRiskBadge assessment={risks[d.id]} />}

                      <Button size="sm" variant="outline" onClick={() => setSelected(d.id)} className="gap-1">
                        <Eye className="w-4 h-4" /> Review
                      </Button>

                      {(activeTab === 'pending' || d.current_status === 'pending_verification' || d.current_status === 'incomplete') && (
                        <>
                          <Button size="sm" onClick={() => openApproveDialog(d.id, 2)} className="bg-emerald-600 hover:bg-emerald-700 gap-1">
                            <ShieldCheck className="w-4 h-4" /> L2
                          </Button>
                          <Button size="sm" onClick={() => openApproveDialog(d.id, 3)} className="bg-blue-600 hover:bg-blue-700 gap-1">
                            <ShieldCheck className="w-4 h-4" /> L3 (SLTDA)
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => openRejectDialog(d.id)} className="gap-1">
                            <Ban className="w-4 h-4" /> Reject
                          </Button>
                        </>
                      )}

                      {d.email && (
                        <Button size="sm" variant="ghost" asChild>
                          <a href={`mailto:${d.email}`}>
                            <Mail className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {!loading && filteredDrivers.length === 0 && (
            <div className="text-gray-600 bg-white p-6 rounded-xl border border-dashed border-gray-200 text-center">
              {searchTerm ? 'No drivers match your search.' : 'No drivers in this category.'}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Approval/Rejection Dialog */}
      <Dialog open={actionDialog.open} onOpenChange={(open) => !processing && setActionDialog({ ...actionDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog.action === 'approve' ? `Approve Driver (Level ${actionDialog.level})` : 'Reject Application'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {actionDialog.action === 'approve' ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 text-sm">
                  {actionDialog.level === 3
                    ? 'Level 3 approval includes SLTDA verification badge. Driver will receive premium listing.'
                    : 'Level 2 approval for standard verified driver status.'}
                </p>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm">
                  The driver will be notified of the rejection with the reason provided below.
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {actionDialog.action === 'approve' ? 'Notes (optional)' : 'Rejection Reason (required)'}
              </label>
              <Textarea
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                placeholder={actionDialog.action === 'approve' ? 'Add any notes...' : 'Explain why the application was rejected...'}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog({ ...actionDialog, open: false })} disabled={processing}>
              Cancel
            </Button>
            <Button
              onClick={handleAction}
              disabled={processing || (actionDialog.action === 'reject' && !actionNotes.trim())}
              className={actionDialog.action === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
            >
              {processing ? 'Processing...' : actionDialog.action === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document Preview Modal */}
      <Dialog open={previewModal.open} onOpenChange={(open) => setPreviewModal({ ...previewModal, open })}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{previewModal.title}</span>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => setZoomLevel(z => Math.max(0.5, z - 0.25))}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm text-gray-500">{Math.round(zoomLevel * 100)}%</span>
                <Button size="sm" variant="outline" onClick={() => setZoomLevel(z => Math.min(3, z + 0.25))}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => setRotation(r => (r + 90) % 360)}>
                  <RotateCw className="w-4 h-4" />
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="overflow-auto max-h-[70vh] flex items-center justify-center bg-gray-100 rounded-lg p-4">
            {previewModal.url && (
              previewModal.url.endsWith('.pdf') ? (
                <iframe src={previewModal.url} className="w-full h-[60vh]" />
              ) : (
                <img
                  src={previewModal.url}
                  alt={previewModal.title}
                  className="max-w-full transition-transform duration-200"
                  style={{ transform: `scale(${zoomLevel}) rotate(${rotation}deg)` }}
                />
              )
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" asChild>
              <a href={previewModal.url} target="_blank" rel="noopener noreferrer">
                Open in New Tab
              </a>
            </Button>
            <Button onClick={() => setPreviewModal({ open: false, url: '', title: '' })}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DriverVerificationQueue
