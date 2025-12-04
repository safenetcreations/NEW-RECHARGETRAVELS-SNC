import { db } from '@/lib/firebase'
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where
} from 'firebase/firestore'

export interface PickupOption {
  id: string
  label: string
  time: string
  additionalCost: number
}

export interface CulturalTour {
  id: string
  title: string
  description: string
  location: string
  duration: string
  price: number
  image: string
  rating?: number
  reviews?: number
  category?: string
  difficulty?: string
  maxGroupSize?: number
  highlights?: string[]
  included?: string[]
  pickupOptions?: PickupOption[]
  featured?: boolean
  videoUrl?: string
  gallery?: string[]
}

export interface CulturalBookingPayload {
  tourId: string
  tourTitle: string
  date: string
  adults: number
  children: number
  contactName: string
  contactEmail: string
  contactPhone?: string
  pickupOption?: string
  pickupAddress?: string
  specialRequests?: string
  currency?: string
  totalPrice: number
  userId?: string
}

const TOURS_COLLECTION = 'cultural_tours'
const BOOKINGS_COLLECTION = 'cultural_bookings'

export const culturalToursService = {
  async getActiveTours(): Promise<CulturalTour[]> {
    try {
      const toursRef = collection(db, TOURS_COLLECTION)
      const q = query(
        toursRef,
        where('is_active', '==', true),
        orderBy('created_at', 'desc')
      )

      const snapshot = await getDocs(q)
      return snapshot.docs.map((docSnap) => {
        const data = docSnap.data()
        return {
          id: docSnap.id,
          title: data.title || '',
          description: data.description || '',
          location: data.location || '',
          duration: data.duration || '',
          price: data.price || 0,
          image: data.image || '',
          rating: data.rating || 4.8,
          reviews: data.reviews || 0,
          category: data.category,
          difficulty: data.difficulty,
          maxGroupSize: data.maxGroupSize,
          highlights: data.highlights || [],
          included: data.included || [],
          pickupOptions: data.pickupOptions || [],
          featured: data.featured,
          videoUrl: data.videoUrl,
          gallery: data.gallery || []
        } as CulturalTour
      })
    } catch (error) {
      console.error('Error loading cultural tours from Firestore:', error)
      return []
    }
  },

  async createBooking(payload: CulturalBookingPayload): Promise<string> {
    try {
      const bookingRef = collection(db, BOOKINGS_COLLECTION)
      const now = Timestamp.now()
      const docRef = await addDoc(bookingRef, {
        ...payload,
        status: 'pending',
        guests: payload.adults + payload.children,
        bookingRef: `CULT-${Date.now().toString(36).toUpperCase()}`,
        createdAt: now,
        updated_at: now,
        userId: payload.userId || 'guest'
      })

      return docRef.id
    } catch (error) {
      console.error('Error creating cultural booking:', error)
      throw error
    }
  }
}
