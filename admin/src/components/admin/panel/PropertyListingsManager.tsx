import React, { useState, useEffect } from 'react'
import { 
  Building2, Search, Filter, CheckCircle, XCircle, Clock, Eye, 
  Trash2, Star, MapPin, DollarSign, Phone, Mail, Calendar,
  ChevronDown, RefreshCw, AlertTriangle, BadgeCheck, X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { db } from '@/lib/firebase'
import { 
  collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy, where 
} from 'firebase/firestore'
import { getFunctions, httpsCallable } from 'firebase/functions'

interface PropertyListing {
  id: string
  name: string
  type: string
  description: string
  city: string
  address: string
  base_price_per_night: number
  currency: string
  amenities: string[]
  images: { url: string; is_primary: boolean }[]
  owner_name: string
  owner_email: string
  owner_phone: string
  status: 'pending' | 'approved' | 'rejected' | 'suspended'
  rejection_reason?: string
  is_featured: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  approved_at?: string
}

const statusColors = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  approved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
  suspended: 'bg-slate-100 text-slate-800 border-slate-200'
}

const statusIcons = {
  pending: Clock,
  approved: CheckCircle,
  rejected: XCircle,
  suspended: AlertTriangle
}

const PropertyListingsManager: React.FC = () => {
  const { toast } = useToast()
  const [listings, setListings] = useState<PropertyListing[]>([])
  const [filteredListings, setFilteredListings] = useState<PropertyListing[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedListing, setSelectedListing] = useState<PropertyListing | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [processing, setProcessing] = useState(false)

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  })

  const functions = getFunctions()

  useEffect(() => {
    fetchListings()
  }, [])

  useEffect(() => {
    filterListings()
  }, [listings, searchTerm, statusFilter])

  const fetchListings = async () => {
    setLoading(true)
    try {
      const listingsRef = collection(db, 'property_listings')
      const q = query(listingsRef, orderBy('created_at', 'desc'))
      const snapshot = await getDocs(q)
      
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PropertyListing[]

      setListings(data)
      
      // Calculate stats
      setStats({
        total: data.length,
        pending: data.filter(l => l.status === 'pending').length,
        approved: data.filter(l => l.status === 'approved').length,
        rejected: data.filter(l => l.status === 'rejected').length
      })
    } catch (error) {
      console.error('Error fetching listings:', error)
      toast({ title: 'Error loading listings', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const filterListings = () => {
    let filtered = [...listings]
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(l => l.status === statusFilter)
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(l => 
        l.name.toLowerCase().includes(term) ||
        l.owner_name.toLowerCase().includes(term) ||
        l.city.toLowerCase().includes(term) ||
        l.owner_email.toLowerCase().includes(term)
      )
    }
    
    setFilteredListings(filtered)
  }

  const handleApprove = async (listing: PropertyListing) => {
    setProcessing(true)
    try {
      const docRef = doc(db, 'property_listings', listing.id)
      await updateDoc(docRef, {
        status: 'approved',
        is_active: true,
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

      // Send approval email
      try {
        const sendEmail = httpsCallable(functions, 'sendPropertyListingEmail')
        await sendEmail({
          type: 'approved',
          listingId: listing.id,
          ownerEmail: listing.owner_email,
          ownerName: listing.owner_name,
          propertyName: listing.name
        })
      } catch (emailError) {
        console.error('Error sending email:', emailError)
      }

      toast({ title: '✅ Property approved!', description: 'Email notification sent to owner.' })
      fetchListings()
      setShowDetailModal(false)
    } catch (error) {
      console.error('Error approving listing:', error)
      toast({ title: 'Error approving property', variant: 'destructive' })
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = async () => {
    if (!selectedListing || !rejectionReason.trim()) {
      toast({ title: 'Please provide a reason', variant: 'destructive' })
      return
    }

    setProcessing(true)
    try {
      const docRef = doc(db, 'property_listings', selectedListing.id)
      await updateDoc(docRef, {
        status: 'rejected',
        rejection_reason: rejectionReason,
        is_active: false,
        updated_at: new Date().toISOString()
      })

      // Send rejection email
      try {
        const sendEmail = httpsCallable(functions, 'sendPropertyListingEmail')
        await sendEmail({
          type: 'rejected',
          listingId: selectedListing.id,
          ownerEmail: selectedListing.owner_email,
          ownerName: selectedListing.owner_name,
          propertyName: selectedListing.name,
          reason: rejectionReason
        })
      } catch (emailError) {
        console.error('Error sending email:', emailError)
      }

      toast({ title: 'Property rejected', description: 'Email notification sent to owner.' })
      setShowRejectModal(false)
      setShowDetailModal(false)
      setRejectionReason('')
      fetchListings()
    } catch (error) {
      console.error('Error rejecting listing:', error)
      toast({ title: 'Error rejecting property', variant: 'destructive' })
    } finally {
      setProcessing(false)
    }
  }

  const handleDelete = async (listing: PropertyListing) => {
    if (!confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      return
    }

    try {
      await deleteDoc(doc(db, 'property_listings', listing.id))
      toast({ title: 'Listing deleted' })
      fetchListings()
      setShowDetailModal(false)
    } catch (error) {
      console.error('Error deleting listing:', error)
      toast({ title: 'Error deleting listing', variant: 'destructive' })
    }
  }

  const toggleFeatured = async (listing: PropertyListing) => {
    try {
      const docRef = doc(db, 'property_listings', listing.id)
      await updateDoc(docRef, {
        is_featured: !listing.is_featured,
        updated_at: new Date().toISOString()
      })
      toast({ title: listing.is_featured ? 'Removed from featured' : 'Added to featured' })
      fetchListings()
    } catch (error) {
      console.error('Error toggling featured:', error)
      toast({ title: 'Error updating listing', variant: 'destructive' })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getPropertyTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      vacation_home: 'Vacation Home',
      apartment: 'Apartment',
      villa: 'Villa',
      luxury_resort: 'Luxury Resort',
      boutique: 'Boutique Hotel',
      guesthouse: 'Guesthouse',
      cabana: 'Cabana',
      eco_lodge: 'Eco Lodge',
      budget: 'Budget Hotel',
      business: 'Business Hotel'
    }
    return labels[type] || type
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Property Listings</h1>
          <p className="text-slate-500">Manage property submissions and approvals</p>
        </div>
        <Button onClick={fetchListings} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-lg">
              <Building2 className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
              <div className="text-sm text-slate-500">Total</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-amber-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
              <div className="text-sm text-slate-500">Pending</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-emerald-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">{stats.approved}</div>
              <div className="text-sm text-slate-500">Approved</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-red-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
              <div className="text-sm text-slate-500">Rejected</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by property, owner, city, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'pending', 'approved', 'rejected'].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(status)}
              className="capitalize"
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      {/* Listings Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading listings...</div>
        ) : filteredListings.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No listings found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left p-4 font-medium text-slate-600">Property</th>
                  <th className="text-left p-4 font-medium text-slate-600">Owner</th>
                  <th className="text-left p-4 font-medium text-slate-600">Type</th>
                  <th className="text-left p-4 font-medium text-slate-600">Price</th>
                  <th className="text-left p-4 font-medium text-slate-600">Status</th>
                  <th className="text-left p-4 font-medium text-slate-600">Submitted</th>
                  <th className="text-right p-4 font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredListings.map((listing) => {
                  const StatusIcon = statusIcons[listing.status]
                  return (
                    <tr key={listing.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {listing.images?.[0]?.url ? (
                            <img 
                              src={listing.images[0].url} 
                              alt={listing.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
                              <Building2 className="w-6 h-6 text-slate-400" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-slate-900 flex items-center gap-2">
                              {listing.name}
                              {listing.is_featured && (
                                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                              )}
                            </div>
                            <div className="text-sm text-slate-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {listing.city}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-slate-900">{listing.owner_name}</div>
                        <div className="text-sm text-slate-500">{listing.owner_email}</div>
                      </td>
                      <td className="p-4 text-slate-600">
                        {getPropertyTypeLabel(listing.type)}
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-slate-900">
                          ${listing.base_price_per_night}/night
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className={`${statusColors[listing.status]} border`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {listing.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm text-slate-500">
                        {formatDate(listing.created_at)}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedListing(listing)
                              setShowDetailModal(true)
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {listing.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700"
                                onClick={() => handleApprove(listing)}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  setSelectedListing(listing)
                                  setShowRejectModal(true)
                                }}
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedListing && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  {selectedListing.name}
                  <Badge className={`${statusColors[selectedListing.status]} border ml-2`}>
                    {selectedListing.status}
                  </Badge>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Images */}
                {selectedListing.images?.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {selectedListing.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img.url}
                        alt={`Property ${idx + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}

                {/* Property Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-500">Property Type</Label>
                    <p className="font-medium">{getPropertyTypeLabel(selectedListing.type)}</p>
                  </div>
                  <div>
                    <Label className="text-slate-500">Price per Night</Label>
                    <p className="font-medium">${selectedListing.base_price_per_night}</p>
                  </div>
                  <div>
                    <Label className="text-slate-500">City</Label>
                    <p className="font-medium">{selectedListing.city}</p>
                  </div>
                  <div>
                    <Label className="text-slate-500">Address</Label>
                    <p className="font-medium">{selectedListing.address}</p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Label className="text-slate-500">Description</Label>
                  <p className="text-slate-700 mt-1">{selectedListing.description || 'No description provided'}</p>
                </div>

                {/* Amenities */}
                {selectedListing.amenities?.length > 0 && (
                  <div>
                    <Label className="text-slate-500">Amenities</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedListing.amenities.map((amenity, idx) => (
                        <Badge key={idx} variant="secondary">{amenity}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Owner Details */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-3">Owner Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span>{selectedListing.owner_email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span>{selectedListing.owner_phone || 'Not provided'}</span>
                    </div>
                  </div>
                </div>

                {/* Rejection Reason */}
                {selectedListing.status === 'rejected' && selectedListing.rejection_reason && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-medium text-red-900 mb-2">Rejection Reason</h4>
                    <p className="text-red-700">{selectedListing.rejection_reason}</p>
                  </div>
                )}
              </div>

              <DialogFooter className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => toggleFeatured(selectedListing)}
                >
                  <Star className={`w-4 h-4 mr-2 ${selectedListing.is_featured ? 'fill-amber-400 text-amber-400' : ''}`} />
                  {selectedListing.is_featured ? 'Remove Featured' : 'Make Featured'}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(selectedListing)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
                {selectedListing.status === 'pending' && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowRejectModal(true)
                      }}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                    <Button
                      className="bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => handleApprove(selectedListing)}
                      disabled={processing}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                  </>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Property Listing</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-slate-600">
              Please provide a reason for rejecting "{selectedListing?.name}". This will be sent to the owner.
            </p>
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject}
              disabled={processing || !rejectionReason.trim()}
            >
              {processing ? 'Rejecting...' : 'Reject Listing'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PropertyListingsManager
