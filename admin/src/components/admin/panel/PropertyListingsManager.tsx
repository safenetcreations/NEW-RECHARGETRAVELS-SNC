import React, { useState, useEffect } from 'react'
import {
  Building2, Search, Filter, CheckCircle, XCircle, Clock, Eye,
  Trash2, Star, MapPin, DollarSign, Phone, Mail, Calendar,
  ChevronDown, RefreshCw, AlertTriangle, BadgeCheck, X, Bed,
  Users, FileText, Image, Wifi, Globe, MessageCircle, Shield,
  Percent, Home
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { db } from '@/lib/firebase'
import {
  collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy, where
} from 'firebase/firestore'
import { getFunctions, httpsCallable } from 'firebase/functions'

interface RoomConfiguration {
  id: string
  name: string
  type: string
  description: string
  max_guests: number
  num_rooms: number
  size_sqm?: number
  beds: { type: string; count: number }[]
  base_price: number
  is_smoking: boolean
  has_balcony: boolean
  has_view: boolean
}

interface PropertyListing {
  id: string
  name: string
  type: string
  description: string
  short_description?: string
  tagline?: string
  star_rating?: number
  languages_spoken?: string[]
  // Location
  location?: {
    address: string
    city: string
    country: string
    postal_code?: string
    neighborhood?: string
    distance_to_airport_km?: number
    distance_to_city_center_km?: number
    distance_to_beach_km?: number
  }
  city?: string
  address?: string
  // Property details
  total_rooms?: number
  max_guests?: number
  rooms?: RoomConfiguration[]
  // Pricing
  pricing?: {
    currency: string
    base_price_per_night: number
    weekend_price_per_night?: number
    weekly_discount_percent?: number
    monthly_discount_percent?: number
    cleaning_fee?: number
    tax_percent?: number
  }
  base_price_per_night?: number
  currency?: string
  // Policies
  policies?: {
    check_in_time: string
    check_out_time: string
    cancellation_policy: string
    min_nights: number
    max_nights: number
    children_allowed: boolean
    pets_allowed: boolean
    smoking_allowed: boolean
  }
  amenities: string[]
  images: { url: string; is_primary: boolean; category?: string }[]
  // Owner info
  owner?: {
    owner_name: string
    owner_email: string
    owner_phone: string
    owner_whatsapp?: string
    business_type: string
    business_name?: string
  }
  owner_name?: string
  owner_email?: string
  owner_phone?: string
  owner_whatsapp?: string
  // Status
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'suspended'
  rejection_reason?: string
  is_featured: boolean
  is_active: boolean
  is_instant_book?: boolean
  // Verification
  documents_verified?: boolean
  identity_verified?: boolean
  property_verified?: boolean
  verification_level?: string
  completion_percentage?: number
  incomplete_sections?: string[]
  // Timestamps
  created_at: string
  updated_at: string
  submitted_at?: string
  approved_at?: string
  approved_by?: string
}

const statusColors: Record<string, string> = {
  draft: 'bg-slate-100 text-slate-800 border-slate-200',
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  approved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
  suspended: 'bg-orange-100 text-orange-800 border-orange-200'
}

const statusIcons: Record<string, React.ElementType> = {
  draft: FileText,
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
    draft: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    suspended: 0
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
        draft: data.filter(l => l.status === 'draft').length,
        pending: data.filter(l => l.status === 'pending').length,
        approved: data.filter(l => l.status === 'approved').length,
        rejected: data.filter(l => l.status === 'rejected').length,
        suspended: data.filter(l => l.status === 'suspended').length
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
      filtered = filtered.filter(l => {
        const ownerName = l.owner?.owner_name || l.owner_name || ''
        const ownerEmail = l.owner?.owner_email || l.owner_email || ''
        const city = l.location?.city || l.city || ''
        return (
          l.name.toLowerCase().includes(term) ||
          ownerName.toLowerCase().includes(term) ||
          city.toLowerCase().includes(term) ||
          ownerEmail.toLowerCase().includes(term) ||
          l.type.toLowerCase().includes(term)
        )
      })
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
        approved_by: 'admin@rechargetravels.com',
        updated_at: new Date().toISOString(),
        verification_level: 'basic'
      })

      // Get owner email from nested or legacy structure
      const ownerEmail = listing.owner?.owner_email || listing.owner_email
      const ownerName = listing.owner?.owner_name || listing.owner_name

      // Send approval email
      if (ownerEmail) {
        try {
          const sendEmail = httpsCallable(functions, 'sendPropertyListingEmail')
          await sendEmail({
            type: 'approved',
            listingId: listing.id,
            ownerEmail,
            ownerName,
            propertyName: listing.name
          })
        } catch (emailError) {
          console.error('Error sending email:', emailError)
        }
      }

      toast({ title: 'Property approved!', description: 'Email notification sent to owner.' })
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

      // Get owner email from nested or legacy structure
      const ownerEmail = selectedListing.owner?.owner_email || selectedListing.owner_email
      const ownerName = selectedListing.owner?.owner_name || selectedListing.owner_name

      // Send rejection email
      if (ownerEmail) {
        try {
          const sendEmail = httpsCallable(functions, 'sendPropertyListingEmail')
          await sendEmail({
            type: 'rejected',
            listingId: selectedListing.id,
            ownerEmail,
            ownerName,
            propertyName: selectedListing.name,
            reason: rejectionReason
          })
        } catch (emailError) {
          console.error('Error sending email:', emailError)
        }
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
      hotel: 'Hotel',
      resort: 'Resort',
      boutique_hotel: 'Boutique Hotel',
      business_hotel: 'Business Hotel',
      villa: 'Villa',
      vacation_home: 'Vacation Home',
      apartment: 'Apartment',
      condo: 'Condominium',
      guesthouse: 'Guesthouse',
      bed_and_breakfast: 'Bed & Breakfast',
      hostel: 'Hostel',
      homestay: 'Homestay',
      eco_lodge: 'Eco Lodge',
      treehouse: 'Treehouse',
      glamping: 'Glamping',
      cabin: 'Cabin',
      beach_house: 'Beach House',
      bungalow: 'Bungalow',
      chalet: 'Chalet',
      cottage: 'Cottage',
      // Legacy types
      luxury_resort: 'Luxury Resort',
      boutique: 'Boutique Hotel',
      cabana: 'Cabana',
      budget: 'Budget Hotel',
      business: 'Business Hotel'
    }
    return labels[type] || type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
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
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
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
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-lg">
              <FileText className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-600">{stats.draft}</div>
              <div className="text-sm text-slate-500">Drafts</div>
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
        <div className="bg-white rounded-xl p-4 border border-orange-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{stats.suspended}</div>
              <div className="text-sm text-slate-500">Suspended</div>
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
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'approved', 'draft', 'rejected', 'suspended'].map((status) => (
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
                  const StatusIcon = statusIcons[listing.status] || Clock
                  const ownerName = listing.owner?.owner_name || listing.owner_name || 'Unknown'
                  const ownerEmail = listing.owner?.owner_email || listing.owner_email || 'No email'
                  const city = listing.location?.city || listing.city || 'Unknown'
                  const price = listing.pricing?.base_price_per_night || listing.base_price_per_night || 0
                  const currency = listing.pricing?.currency || listing.currency || 'USD'

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
                              {listing.is_instant_book && (
                                <Badge variant="outline" className="text-xs">Instant</Badge>
                              )}
                            </div>
                            <div className="text-sm text-slate-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {city}
                              {listing.star_rating && (
                                <span className="ml-2 flex items-center gap-0.5">
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                  {listing.star_rating}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-slate-900">{ownerName}</div>
                        <div className="text-sm text-slate-500">{ownerEmail}</div>
                      </td>
                      <td className="p-4 text-slate-600">
                        {getPropertyTypeLabel(listing.type)}
                        {listing.total_rooms && (
                          <div className="text-xs text-slate-400">{listing.total_rooms} rooms</div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-slate-900">
                          {currency} {price}/night
                        </div>
                        {listing.completion_percentage !== undefined && (
                          <div className="text-xs text-slate-400">{listing.completion_percentage}% complete</div>
                        )}
                      </td>
                      <td className="p-4">
                        <Badge className={`${statusColors[listing.status] || statusColors.pending} border`}>
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedListing && (() => {
            const ownerName = selectedListing.owner?.owner_name || selectedListing.owner_name || 'Unknown'
            const ownerEmail = selectedListing.owner?.owner_email || selectedListing.owner_email || ''
            const ownerPhone = selectedListing.owner?.owner_phone || selectedListing.owner_phone || ''
            const ownerWhatsapp = selectedListing.owner?.owner_whatsapp || selectedListing.owner_whatsapp || ''
            const city = selectedListing.location?.city || selectedListing.city || 'Unknown'
            const address = selectedListing.location?.address || selectedListing.address || ''
            const price = selectedListing.pricing?.base_price_per_night || selectedListing.base_price_per_night || 0
            const currency = selectedListing.pricing?.currency || selectedListing.currency || 'USD'

            return (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    {selectedListing.name}
                    {selectedListing.star_rating && (
                      <span className="flex items-center gap-0.5 ml-2">
                        {Array.from({ length: selectedListing.star_rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </span>
                    )}
                    <Badge className={`${statusColors[selectedListing.status] || statusColors.pending} border ml-2`}>
                      {selectedListing.status}
                    </Badge>
                  </DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="rooms">Rooms</TabsTrigger>
                    <TabsTrigger value="pricing">Pricing</TabsTrigger>
                    <TabsTrigger value="policies">Policies</TabsTrigger>
                    <TabsTrigger value="owner">Owner</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4 mt-4">
                    {/* Images */}
                    {selectedListing.images?.length > 0 && (
                      <div className="grid grid-cols-4 gap-2">
                        {selectedListing.images.slice(0, 8).map((img, idx) => (
                          <img
                            key={idx}
                            src={img.url}
                            alt={`Property ${idx + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                        ))}
                        {selectedListing.images.length > 8 && (
                          <div className="w-full h-24 bg-slate-100 rounded-lg flex items-center justify-center">
                            <span className="text-slate-500 font-medium">+{selectedListing.images.length - 8} more</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Property Details */}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label className="text-slate-500">Property Type</Label>
                        <p className="font-medium">{getPropertyTypeLabel(selectedListing.type)}</p>
                      </div>
                      <div>
                        <Label className="text-slate-500">City</Label>
                        <p className="font-medium">{city}</p>
                      </div>
                      <div>
                        <Label className="text-slate-500">Total Rooms</Label>
                        <p className="font-medium">{selectedListing.total_rooms || 1}</p>
                      </div>
                      <div>
                        <Label className="text-slate-500">Max Guests</Label>
                        <p className="font-medium">{selectedListing.max_guests || 2}</p>
                      </div>
                      <div>
                        <Label className="text-slate-500">Address</Label>
                        <p className="font-medium">{address}</p>
                      </div>
                      <div>
                        <Label className="text-slate-500">Completion</Label>
                        <p className="font-medium">{selectedListing.completion_percentage || 0}%</p>
                      </div>
                    </div>

                    {/* Tagline */}
                    {selectedListing.tagline && (
                      <div>
                        <Label className="text-slate-500">Tagline</Label>
                        <p className="text-slate-700 italic">"{selectedListing.tagline}"</p>
                      </div>
                    )}

                    {/* Description */}
                    <div>
                      <Label className="text-slate-500">Description</Label>
                      <p className="text-slate-700 mt-1">{selectedListing.description || 'No description provided'}</p>
                    </div>

                    {/* Languages */}
                    {selectedListing.languages_spoken && selectedListing.languages_spoken.length > 0 && (
                      <div>
                        <Label className="text-slate-500">Languages Spoken</Label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selectedListing.languages_spoken.map((lang, idx) => (
                            <Badge key={idx} variant="outline">{lang}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Amenities */}
                    {selectedListing.amenities?.length > 0 && (
                      <div>
                        <Label className="text-slate-500">Amenities ({selectedListing.amenities.length})</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedListing.amenities.map((amenity, idx) => (
                            <Badge key={idx} variant="secondary">{amenity.replace(/_/g, ' ')}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="rooms" className="space-y-4 mt-4">
                    {selectedListing.rooms && selectedListing.rooms.length > 0 ? (
                      selectedListing.rooms.map((room) => (
                        <div key={room.id} className="bg-slate-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-slate-900">{room.name}</h4>
                            <Badge>{room.type.replace(/_/g, ' ')}</Badge>
                          </div>
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-slate-500">Quantity:</span>
                              <span className="ml-2 font-medium">{room.num_rooms}</span>
                            </div>
                            <div>
                              <span className="text-slate-500">Max Guests:</span>
                              <span className="ml-2 font-medium">{room.max_guests}</span>
                            </div>
                            <div>
                              <span className="text-slate-500">Price:</span>
                              <span className="ml-2 font-medium">${room.base_price}/night</span>
                            </div>
                            <div>
                              <span className="text-slate-500">Size:</span>
                              <span className="ml-2 font-medium">{room.size_sqm || 'N/A'} sqm</span>
                            </div>
                          </div>
                          {room.beds && room.beds.length > 0 && (
                            <div className="mt-2 text-sm">
                              <span className="text-slate-500">Beds:</span>
                              <span className="ml-2">
                                {room.beds.map((bed, i) => `${bed.count}x ${bed.type.replace(/_/g, ' ')}`).join(', ')}
                              </span>
                            </div>
                          )}
                          <div className="mt-2 flex gap-2">
                            {room.has_balcony && <Badge variant="outline">Balcony</Badge>}
                            {room.has_view && <Badge variant="outline">View</Badge>}
                            {room.is_smoking && <Badge variant="outline">Smoking</Badge>}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500">No room configurations added</p>
                    )}
                  </TabsContent>

                  <TabsContent value="pricing" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-emerald-50 rounded-lg p-4">
                        <Label className="text-emerald-700">Base Price</Label>
                        <p className="text-2xl font-bold text-emerald-900">{currency} {price}/night</p>
                      </div>
                      {selectedListing.pricing?.weekend_price_per_night && (
                        <div className="bg-blue-50 rounded-lg p-4">
                          <Label className="text-blue-700">Weekend Price</Label>
                          <p className="text-2xl font-bold text-blue-900">{currency} {selectedListing.pricing.weekend_price_per_night}/night</p>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {selectedListing.pricing?.weekly_discount_percent && (
                        <div>
                          <Label className="text-slate-500">Weekly Discount</Label>
                          <p className="font-medium">{selectedListing.pricing.weekly_discount_percent}%</p>
                        </div>
                      )}
                      {selectedListing.pricing?.monthly_discount_percent && (
                        <div>
                          <Label className="text-slate-500">Monthly Discount</Label>
                          <p className="font-medium">{selectedListing.pricing.monthly_discount_percent}%</p>
                        </div>
                      )}
                      {selectedListing.pricing?.cleaning_fee && (
                        <div>
                          <Label className="text-slate-500">Cleaning Fee</Label>
                          <p className="font-medium">{currency} {selectedListing.pricing.cleaning_fee}</p>
                        </div>
                      )}
                      {selectedListing.pricing?.tax_percent && (
                        <div>
                          <Label className="text-slate-500">Tax</Label>
                          <p className="font-medium">{selectedListing.pricing.tax_percent}%</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="policies" className="space-y-4 mt-4">
                    {selectedListing.policies ? (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-slate-500">Check-in Time</Label>
                            <p className="font-medium">{selectedListing.policies.check_in_time}</p>
                          </div>
                          <div>
                            <Label className="text-slate-500">Check-out Time</Label>
                            <p className="font-medium">{selectedListing.policies.check_out_time}</p>
                          </div>
                          <div>
                            <Label className="text-slate-500">Cancellation Policy</Label>
                            <p className="font-medium capitalize">{selectedListing.policies.cancellation_policy?.replace(/_/g, ' ')}</p>
                          </div>
                          <div>
                            <Label className="text-slate-500">Stay Duration</Label>
                            <p className="font-medium">{selectedListing.policies.min_nights} - {selectedListing.policies.max_nights} nights</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <Badge variant={selectedListing.policies.children_allowed ? 'default' : 'secondary'}>
                            {selectedListing.policies.children_allowed ? '✓' : '✗'} Children
                          </Badge>
                          <Badge variant={selectedListing.policies.pets_allowed ? 'default' : 'secondary'}>
                            {selectedListing.policies.pets_allowed ? '✓' : '✗'} Pets
                          </Badge>
                          <Badge variant={selectedListing.policies.smoking_allowed ? 'default' : 'secondary'}>
                            {selectedListing.policies.smoking_allowed ? '✓' : '✗'} Smoking
                          </Badge>
                        </div>
                      </>
                    ) : (
                      <p className="text-slate-500">No policies configured</p>
                    )}
                  </TabsContent>

                  <TabsContent value="owner" className="space-y-4 mt-4">
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h4 className="font-medium text-slate-900 mb-3">Contact Information</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-slate-400" />
                          <span>{ownerName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-slate-400" />
                          <span>{ownerEmail || 'Not provided'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-slate-400" />
                          <span>{ownerPhone || 'Not provided'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageCircle className="w-4 h-4 text-slate-400" />
                          <span>{ownerWhatsapp || 'Not provided'}</span>
                        </div>
                      </div>
                      {selectedListing.owner?.business_type && (
                        <div className="mt-4 pt-4 border-t">
                          <Label className="text-slate-500">Business Type</Label>
                          <p className="font-medium capitalize">{selectedListing.owner.business_type}</p>
                          {selectedListing.owner.business_name && (
                            <>
                              <Label className="text-slate-500 mt-2">Business Name</Label>
                              <p className="font-medium">{selectedListing.owner.business_name}</p>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Verification Status */}
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h4 className="font-medium text-slate-900 mb-3">Verification Status</h4>
                      <div className="flex flex-wrap gap-3">
                        <Badge variant={selectedListing.documents_verified ? 'default' : 'secondary'}>
                          <FileText className="w-3 h-3 mr-1" />
                          Documents {selectedListing.documents_verified ? '✓' : '✗'}
                        </Badge>
                        <Badge variant={selectedListing.identity_verified ? 'default' : 'secondary'}>
                          <Shield className="w-3 h-3 mr-1" />
                          Identity {selectedListing.identity_verified ? '✓' : '✗'}
                        </Badge>
                        <Badge variant={selectedListing.property_verified ? 'default' : 'secondary'}>
                          <Home className="w-3 h-3 mr-1" />
                          Property {selectedListing.property_verified ? '✓' : '✗'}
                        </Badge>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Rejection Reason */}
                {selectedListing.status === 'rejected' && selectedListing.rejection_reason && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                    <h4 className="font-medium text-red-900 mb-2">Rejection Reason</h4>
                    <p className="text-red-700">{selectedListing.rejection_reason}</p>
                  </div>
                )}

                {/* Incomplete Sections */}
                {selectedListing.incomplete_sections && selectedListing.incomplete_sections.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                    <h4 className="font-medium text-amber-900 mb-2">Incomplete Sections</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedListing.incomplete_sections.map((section, idx) => (
                        <Badge key={idx} variant="outline" className="border-amber-300 text-amber-700">{section}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <DialogFooter className="flex gap-2 mt-4">
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
            )
          })()}
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
