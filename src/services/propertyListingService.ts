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
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { getFunctions, httpsCallable } from 'firebase/functions'

const PROPERTY_LISTINGS_COLLECTION = 'property_listings'

export type PropertyStatus = 'pending' | 'approved' | 'rejected' | 'suspended'
export type PropertyType = 'vacation_home' | 'apartment' | 'villa' | 'luxury_resort' | 'boutique' | 'guesthouse' | 'cabana' | 'eco_lodge' | 'budget' | 'business'

export interface PropertyListing {
  id?: string
  // Property Details
  name: string
  type: PropertyType
  description: string
  city: string
  address: string
  latitude?: number
  longitude?: number
  base_price_per_night: number
  currency: string
  amenities: string[]
  images: PropertyImage[]
  
  // Owner Details
  owner_name: string
  owner_email: string
  owner_phone: string
  owner_whatsapp?: string
  
  // Business Details (optional)
  business_name?: string
  business_registration?: string
  tax_number?: string
  
  // Bank Details
  bank_name?: string
  account_name?: string
  account_number?: string
  branch_code?: string
  
  // Status & Meta
  status: PropertyStatus
  rejection_reason?: string
  admin_notes?: string
  is_featured: boolean
  is_active: boolean
  
  // Verification
  documents_verified: boolean
  identity_verified: boolean
  property_verified: boolean
  
  // Timestamps
  created_at: string
  updated_at: string
  approved_at?: string
  approved_by?: string
}

export interface PropertyImage {
  id: string
  url: string
  is_primary: boolean
  caption?: string
  sort_order: number
}

export interface PropertyListingStats {
  total: number
  pending: number
  approved: number
  rejected: number
  suspended: number
}

const functions = getFunctions()

export const propertyListingService = {
  // Create a new property listing
  async createListing(data: Omit<PropertyListing, 'id' | 'created_at' | 'updated_at' | 'status'>): Promise<string> {
    try {
      const listingData = {
        ...data,
        status: 'pending' as PropertyStatus,
        is_featured: false,
        is_active: false,
        documents_verified: false,
        identity_verified: false,
        property_verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const docRef = await addDoc(collection(db, PROPERTY_LISTINGS_COLLECTION), listingData)
      
      // Send confirmation email via Cloud Function
      try {
        const sendEmail = httpsCallable(functions, 'sendPropertyListingEmail')
        await sendEmail({
          type: 'confirmation',
          listingId: docRef.id,
          ownerEmail: data.owner_email,
          ownerName: data.owner_name,
          propertyName: data.name
        })
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError)
        // Don't fail the listing creation if email fails
      }

      return docRef.id
    } catch (error) {
      console.error('Error creating property listing:', error)
      throw error
    }
  },

  // Upload property images
  async uploadImages(listingId: string, files: File[]): Promise<PropertyImage[]> {
    const uploadedImages: PropertyImage[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`
      const storageRef = ref(storage, `property_listings/${listingId}/images/${fileName}`)
      
      await uploadBytes(storageRef, file)
      const url = await getDownloadURL(storageRef)
      
      uploadedImages.push({
        id: `img_${Date.now()}_${i}`,
        url,
        is_primary: i === 0,
        sort_order: i
      })
    }

    return uploadedImages
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
        pending: 0,
        approved: 0,
        rejected: 0,
        suspended: 0
      }

      allDocs.forEach(doc => {
        const data = doc.data()
        stats.total++
        switch (data.status) {
          case 'pending': stats.pending++; break
          case 'approved': stats.approved++; break
          case 'rejected': stats.rejected++; break
          case 'suspended': stats.suspended++; break
        }
      })

      return stats
    } catch (error) {
      console.error('Error fetching stats:', error)
      return { total: 0, pending: 0, approved: 0, rejected: 0, suspended: 0 }
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
