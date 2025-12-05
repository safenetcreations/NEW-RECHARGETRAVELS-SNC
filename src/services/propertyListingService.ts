import { db, storage } from '@/lib/firebase'
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { getFunctions, httpsCallable } from 'firebase/functions'

const PROPERTY_LISTINGS_COLLECTION = 'property_listings'

export type PropertyStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'suspended'
export type PropertyType =
  | 'hotel' | 'resort' | 'boutique_hotel' | 'business_hotel'
  | 'villa' | 'vacation_home' | 'apartment' | 'condo'
  | 'guesthouse' | 'bed_and_breakfast' | 'hostel' | 'homestay'
  | 'eco_lodge' | 'treehouse' | 'glamping' | 'cabin'
  | 'beach_house' | 'bungalow' | 'chalet' | 'cottage'

export type RoomType = 'standard' | 'deluxe' | 'suite' | 'family' | 'presidential' | 'penthouse' | 'studio' | 'dormitory'
export type BedType = 'single' | 'double' | 'queen' | 'king' | 'twin' | 'bunk' | 'sofa_bed'
export type CancellationPolicy = 'flexible' | 'moderate' | 'strict' | 'non_refundable'
export type MealPlan = 'room_only' | 'breakfast' | 'half_board' | 'full_board' | 'all_inclusive'

// Room/Unit Configuration
export interface RoomConfiguration {
  id: string
  name: string
  type: RoomType
  description: string
  max_guests: number
  num_rooms: number // How many of this room type
  size_sqm?: number
  beds: {
    type: BedType
    count: number
  }[]
  amenities: string[]
  images: PropertyImage[]
  base_price: number
  weekend_price?: number
  extra_person_charge?: number
  is_smoking: boolean
  has_balcony: boolean
  has_view: boolean
  view_type?: string // 'ocean' | 'mountain' | 'garden' | 'pool' | 'city'
}

// Pricing Configuration
export interface PricingConfig {
  currency: string
  base_price_per_night: number
  weekend_price_per_night?: number
  weekly_discount_percent?: number
  monthly_discount_percent?: number
  cleaning_fee?: number
  service_fee_percent?: number
  tax_percent?: number
  extra_guest_charge?: number
  child_discount_percent?: number
  infant_free: boolean
  seasonal_pricing?: SeasonalPrice[]
}

export interface SeasonalPrice {
  id: string
  name: string
  start_date: string
  end_date: string
  price_multiplier: number // 1.5 = 50% more, 0.8 = 20% off
}

// Policies
export interface PropertyPolicies {
  check_in_time: string
  check_out_time: string
  early_check_in_available: boolean
  late_check_out_available: boolean
  cancellation_policy: CancellationPolicy
  cancellation_deadline_hours: number
  refund_percent: number
  min_nights: number
  max_nights: number
  children_allowed: boolean
  min_child_age?: number
  pets_allowed: boolean
  pet_fee?: number
  smoking_allowed: boolean
  parties_allowed: boolean
  quiet_hours_start?: string
  quiet_hours_end?: string
  age_restriction?: number
  id_required: boolean
  damage_deposit?: number
  house_rules: string[]
}

// Location Details
export interface LocationDetails {
  address: string
  address_line_2?: string
  city: string
  state_province?: string
  postal_code?: string
  country: string
  latitude?: number
  longitude?: number
  neighborhood?: string
  distance_to_airport_km?: number
  distance_to_city_center_km?: number
  distance_to_beach_km?: number
  nearby_attractions?: {
    name: string
    distance_km: number
    type: string
  }[]
  transportation_options?: string[]
}

// Contact & Business
export interface OwnerDetails {
  owner_name: string
  owner_email: string
  owner_phone: string
  owner_whatsapp?: string
  owner_photo?: string
  owner_bio?: string
  business_name?: string
  business_registration?: string
  tax_number?: string
  business_type: 'individual' | 'company' | 'partnership'
  years_in_business?: number
}

export interface BankDetails {
  bank_name: string
  account_name: string
  account_number: string
  branch_code?: string
  swift_code?: string
  iban?: string
  payment_method: 'bank_transfer' | 'paypal' | 'stripe'
  payout_schedule: 'weekly' | 'biweekly' | 'monthly'
}

// Documents
export interface PropertyDocument {
  id: string
  type: 'business_registration' | 'tax_certificate' | 'tourism_license' | 'insurance' | 'owner_id' | 'property_deed' | 'other'
  name: string
  url: string
  uploaded_at: string
  verified: boolean
  verified_at?: string
  verified_by?: string
  expiry_date?: string
  notes?: string
}

export interface PropertyListing {
  id?: string

  // Basic Info
  name: string
  type: PropertyType
  star_rating?: number // 1-5
  description: string
  short_description?: string
  tagline?: string
  languages_spoken: string[]

  // Location
  location: LocationDetails

  // Legacy fields for backward compatibility
  city?: string
  address?: string
  latitude?: number
  longitude?: number

  // Property Specifics
  total_rooms: number
  total_beds?: number
  max_guests: number
  floors?: number
  year_built?: number
  last_renovated?: number
  property_size_sqm?: number

  // Room Configurations
  rooms: RoomConfiguration[]

  // Amenities (Property-wide)
  amenities: string[]
  accessibility_features?: string[]
  safety_features?: string[]

  // Media
  images: PropertyImage[]
  video_url?: string
  virtual_tour_url?: string

  // Pricing
  pricing: PricingConfig
  base_price_per_night?: number // Legacy
  currency?: string // Legacy

  // Meal Options
  meal_plans_available: MealPlan[]
  restaurant_on_site: boolean
  room_service_available: boolean
  breakfast_included: boolean
  breakfast_price?: number

  // Policies
  policies: PropertyPolicies

  // Owner & Business
  owner: OwnerDetails
  owner_name?: string // Legacy
  owner_email?: string // Legacy
  owner_phone?: string // Legacy
  owner_whatsapp?: string // Legacy

  // Bank Details
  bank_details?: BankDetails
  bank_name?: string // Legacy
  account_name?: string // Legacy
  account_number?: string // Legacy
  branch_code?: string // Legacy

  // Documents
  documents: PropertyDocument[]

  // Status & Meta
  status: PropertyStatus
  rejection_reason?: string
  admin_notes?: string
  is_featured: boolean
  is_active: boolean
  is_instant_book: boolean
  response_time_hours?: number
  acceptance_rate?: number

  // Verification
  documents_verified: boolean
  identity_verified: boolean
  property_verified: boolean
  verification_level: 'none' | 'basic' | 'verified' | 'premium'

  // Stats
  total_bookings?: number
  total_reviews?: number
  average_rating?: number

  // Timestamps
  created_at: string
  updated_at: string
  submitted_at?: string
  approved_at?: string
  approved_by?: string
  last_booked_at?: string

  // Completion Tracking
  completion_percentage: number
  incomplete_sections: string[]
}

export interface PropertyImage {
  id: string
  url: string
  is_primary: boolean
  caption?: string
  category?: 'exterior' | 'interior' | 'room' | 'bathroom' | 'amenities' | 'dining' | 'pool' | 'view' | 'other'
  sort_order: number
  width?: number
  height?: number
}

export interface PropertyListingStats {
  total: number
  draft: number
  pending: number
  approved: number
  rejected: number
  suspended: number
}

// Default values for new listings
const DEFAULT_PRICING: PricingConfig = {
  currency: 'USD',
  base_price_per_night: 0,
  infant_free: true
}

const DEFAULT_POLICIES: PropertyPolicies = {
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
}

const DEFAULT_LOCATION: LocationDetails = {
  address: '',
  city: '',
  country: 'Sri Lanka'
}

const DEFAULT_OWNER: OwnerDetails = {
  owner_name: '',
  owner_email: '',
  owner_phone: '',
  business_type: 'individual'
}

const functions = getFunctions()

// Calculate completion percentage
function calculateCompletion(data: Partial<PropertyListing>): { percentage: number; incomplete: string[] } {
  const sections = [
    { name: 'Basic Info', complete: !!(data.name && data.type && data.description) },
    { name: 'Location', complete: !!(data.location?.address && data.location?.city) },
    { name: 'Property Details', complete: !!(data.total_rooms && data.max_guests) },
    { name: 'Rooms', complete: !!(data.rooms && data.rooms.length > 0) },
    { name: 'Photos', complete: !!(data.images && data.images.length >= 5) },
    { name: 'Pricing', complete: !!(data.pricing?.base_price_per_night && data.pricing.base_price_per_night > 0) },
    { name: 'Policies', complete: !!(data.policies?.check_in_time && data.policies?.cancellation_policy) },
    { name: 'Owner Info', complete: !!(data.owner?.owner_name && data.owner?.owner_email && data.owner?.owner_phone) }
  ]

  const completed = sections.filter(s => s.complete).length
  const incomplete = sections.filter(s => !s.complete).map(s => s.name)

  return {
    percentage: Math.round((completed / sections.length) * 100),
    incomplete
  }
}

export const propertyListingService = {
  // Create a new property listing (as draft)
  async createListing(data: Partial<PropertyListing>): Promise<string> {
    try {
      const { percentage, incomplete } = calculateCompletion(data)

      const listingData: Partial<PropertyListing> = {
        // Basic Info
        name: data.name || '',
        type: data.type || 'hotel',
        description: data.description || '',
        short_description: data.short_description || '',
        tagline: data.tagline || '',
        star_rating: data.star_rating,
        languages_spoken: data.languages_spoken || ['English'],

        // Location
        location: data.location || DEFAULT_LOCATION,
        city: data.location?.city || data.city || '',
        address: data.location?.address || data.address || '',

        // Property Specifics
        total_rooms: data.total_rooms || 1,
        max_guests: data.max_guests || 2,

        // Rooms
        rooms: data.rooms || [],

        // Amenities
        amenities: data.amenities || [],
        accessibility_features: data.accessibility_features || [],
        safety_features: data.safety_features || [],

        // Images
        images: data.images || [],

        // Pricing
        pricing: data.pricing || DEFAULT_PRICING,
        base_price_per_night: data.pricing?.base_price_per_night || data.base_price_per_night || 0,
        currency: data.pricing?.currency || data.currency || 'USD',

        // Meal Options
        meal_plans_available: data.meal_plans_available || ['room_only'],
        restaurant_on_site: data.restaurant_on_site || false,
        room_service_available: data.room_service_available || false,
        breakfast_included: data.breakfast_included || false,

        // Policies
        policies: data.policies || DEFAULT_POLICIES,

        // Owner
        owner: data.owner || DEFAULT_OWNER,
        owner_name: data.owner?.owner_name || data.owner_name || '',
        owner_email: data.owner?.owner_email || data.owner_email || '',
        owner_phone: data.owner?.owner_phone || data.owner_phone || '',
        owner_whatsapp: data.owner?.owner_whatsapp || data.owner_whatsapp || '',

        // Bank Details
        bank_details: data.bank_details,

        // Documents
        documents: data.documents || [],

        // Status
        status: 'draft' as PropertyStatus,
        is_featured: false,
        is_active: false,
        is_instant_book: data.is_instant_book || false,

        // Verification
        documents_verified: false,
        identity_verified: false,
        property_verified: false,
        verification_level: 'none',

        // Completion
        completion_percentage: percentage,
        incomplete_sections: incomplete,

        // Timestamps
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const docRef = await addDoc(collection(db, PROPERTY_LISTINGS_COLLECTION), listingData)
      return docRef.id
    } catch (error) {
      console.error('Error creating property listing:', error)
      throw error
    }
  },

  // Submit listing for review
  async submitForReview(listingId: string): Promise<void> {
    try {
      const listing = await this.getListingById(listingId)
      if (!listing) throw new Error('Listing not found')

      const { percentage } = calculateCompletion(listing)
      if (percentage < 80) {
        throw new Error('Please complete at least 80% of your listing before submitting')
      }

      const docRef = doc(db, PROPERTY_LISTINGS_COLLECTION, listingId)
      await updateDoc(docRef, {
        status: 'pending',
        submitted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

      // Send confirmation email
      const ownerEmail = listing.owner?.owner_email || listing.owner_email
      const ownerName = listing.owner?.owner_name || listing.owner_name

      if (ownerEmail) {
        try {
          const sendEmail = httpsCallable(functions, 'sendPropertyListingEmail')
          await sendEmail({
            type: 'confirmation',
            listingId,
            ownerEmail,
            ownerName,
            propertyName: listing.name
          })
        } catch (emailError) {
          console.error('Error sending confirmation email:', emailError)
        }
      }
    } catch (error) {
      console.error('Error submitting listing:', error)
      throw error
    }
  },

  // Save draft (auto-save)
  async saveDraft(listingId: string, data: Partial<PropertyListing>): Promise<void> {
    try {
      const { percentage, incomplete } = calculateCompletion(data)

      const docRef = doc(db, PROPERTY_LISTINGS_COLLECTION, listingId)
      await updateDoc(docRef, {
        ...data,
        completion_percentage: percentage,
        incomplete_sections: incomplete,
        updated_at: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error saving draft:', error)
      throw error
    }
  },

  // Upload property images
  async uploadImages(listingId: string, files: File[], category?: string): Promise<PropertyImage[]> {
    const uploadedImages: PropertyImage[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const fileName = `${Date.now()}_${i}_${file.name.replace(/\s+/g, '_')}`
      const storageRef = ref(storage, `property_listings/${listingId}/images/${fileName}`)

      await uploadBytes(storageRef, file)
      const url = await getDownloadURL(storageRef)

      uploadedImages.push({
        id: `img_${Date.now()}_${i}`,
        url,
        is_primary: i === 0 && uploadedImages.length === 0,
        category: (category as PropertyImage['category']) || 'other',
        sort_order: i
      })
    }

    return uploadedImages
  },

  // Delete image
  async deleteImage(listingId: string, imageUrl: string): Promise<void> {
    try {
      // Extract path from URL and delete from storage
      const storageRef = ref(storage, imageUrl)
      await deleteObject(storageRef)
    } catch (error) {
      console.error('Error deleting image:', error)
      // Continue even if storage delete fails
    }
  },

  // Upload document
  async uploadDocument(listingId: string, file: File, docType: PropertyDocument['type']): Promise<PropertyDocument> {
    const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`
    const storageRef = ref(storage, `property_listings/${listingId}/documents/${fileName}`)

    await uploadBytes(storageRef, file)
    const url = await getDownloadURL(storageRef)

    return {
      id: `doc_${Date.now()}`,
      type: docType,
      name: file.name,
      url,
      uploaded_at: new Date().toISOString(),
      verified: false
    }
  },

  // Get all listings (admin)
  async getAllListings(statusFilter?: PropertyStatus): Promise<PropertyListing[]> {
    try {
      const listingsRef = collection(db, PROPERTY_LISTINGS_COLLECTION)
      let q = query(listingsRef, orderBy('created_at', 'desc'))
      
      if (statusFilter) {
        q = query(listingsRef, where('status', '==', statusFilter), orderBy('created_at', 'desc'))
      }

      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as PropertyListing))
    } catch (error) {
      console.error('Error fetching property listings:', error)
      return []
    }
  },

  // Get listing by ID
  async getListingById(listingId: string): Promise<PropertyListing | null> {
    try {
      const docRef = doc(db, PROPERTY_LISTINGS_COLLECTION, listingId)
      const docSnap = await getDoc(docRef)
      
      if (!docSnap.exists()) return null
      
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as PropertyListing
    } catch (error) {
      console.error('Error fetching property listing:', error)
      return null
    }
  },

  // Get listings by owner email
  async getListingsByOwner(email: string): Promise<PropertyListing[]> {
    try {
      const listingsRef = collection(db, PROPERTY_LISTINGS_COLLECTION)
      const q = query(listingsRef, where('owner_email', '==', email), orderBy('created_at', 'desc'))
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as PropertyListing))
    } catch (error) {
      console.error('Error fetching owner listings:', error)
      return []
    }
  },

  // Approve listing (admin)
  async approveListing(listingId: string, adminEmail: string): Promise<void> {
    try {
      const docRef = doc(db, PROPERTY_LISTINGS_COLLECTION, listingId)
      await updateDoc(docRef, {
        status: 'approved',
        is_active: true,
        approved_at: new Date().toISOString(),
        approved_by: adminEmail,
        updated_at: new Date().toISOString()
      })

      // Get listing data for email
      const listing = await this.getListingById(listingId)
      if (listing) {
        try {
          const sendEmail = httpsCallable(functions, 'sendPropertyListingEmail')
          await sendEmail({
            type: 'approved',
            listingId,
            ownerEmail: listing.owner_email,
            ownerName: listing.owner_name,
            propertyName: listing.name
          })
        } catch (emailError) {
          console.error('Error sending approval email:', emailError)
        }
      }
    } catch (error) {
      console.error('Error approving listing:', error)
      throw error
    }
  },

  // Reject listing (admin)
  async rejectListing(listingId: string, reason: string): Promise<void> {
    try {
      const docRef = doc(db, PROPERTY_LISTINGS_COLLECTION, listingId)
      await updateDoc(docRef, {
        status: 'rejected',
        rejection_reason: reason,
        is_active: false,
        updated_at: new Date().toISOString()
      })

      // Get listing data for email
      const listing = await this.getListingById(listingId)
      if (listing) {
        try {
          const sendEmail = httpsCallable(functions, 'sendPropertyListingEmail')
          await sendEmail({
            type: 'rejected',
            listingId,
            ownerEmail: listing.owner_email,
            ownerName: listing.owner_name,
            propertyName: listing.name,
            reason
          })
        } catch (emailError) {
          console.error('Error sending rejection email:', emailError)
        }
      }
    } catch (error) {
      console.error('Error rejecting listing:', error)
      throw error
    }
  },

  // Update listing
  async updateListing(listingId: string, data: Partial<PropertyListing>): Promise<void> {
    try {
      const docRef = doc(db, PROPERTY_LISTINGS_COLLECTION, listingId)
      await updateDoc(docRef, {
        ...data,
        updated_at: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error updating listing:', error)
      throw error
    }
  },

  // Delete listing
  async deleteListing(listingId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, PROPERTY_LISTINGS_COLLECTION, listingId))
    } catch (error) {
      console.error('Error deleting listing:', error)
      throw error
    }
  },

  // Get stats
  async getStats(): Promise<PropertyListingStats> {
    try {
      const listingsRef = collection(db, PROPERTY_LISTINGS_COLLECTION)
      const allDocs = await getDocs(listingsRef)

      const stats: PropertyListingStats = {
        total: 0,
        draft: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        suspended: 0
      }

      allDocs.forEach(doc => {
        const data = doc.data()
        stats.total++
        switch (data.status) {
          case 'draft': stats.draft++; break
          case 'pending': stats.pending++; break
          case 'approved': stats.approved++; break
          case 'rejected': stats.rejected++; break
          case 'suspended': stats.suspended++; break
        }
      })

      return stats
    } catch (error) {
      console.error('Error fetching stats:', error)
      return { total: 0, draft: 0, pending: 0, approved: 0, rejected: 0, suspended: 0 }
    }
  },

  // Toggle featured status
  async toggleFeatured(listingId: string, isFeatured: boolean): Promise<void> {
    try {
      const docRef = doc(db, PROPERTY_LISTINGS_COLLECTION, listingId)
      await updateDoc(docRef, {
        is_featured: isFeatured,
        updated_at: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error toggling featured status:', error)
      throw error
    }
  },

  // Suspend listing
  async suspendListing(listingId: string, reason: string): Promise<void> {
    try {
      const docRef = doc(db, PROPERTY_LISTINGS_COLLECTION, listingId)
      await updateDoc(docRef, {
        status: 'suspended',
        admin_notes: reason,
        is_active: false,
        updated_at: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error suspending listing:', error)
      throw error
    }
  }
}

export default propertyListingService
