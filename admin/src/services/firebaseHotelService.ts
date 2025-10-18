import { db, storage } from '@/lib/firebase'
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  QueryConstraint
} from 'firebase/firestore'

export interface Hotel {
  id: string
  name: string
  description: string
  price_per_night: number
  category: string
  destination: string
  amenities?: string[]
  images?: any[]
  rating?: number
  total_reviews?: number
  is_active: boolean
  created_at: string
  updated_at: string
}

const HOTELS_COLLECTION = 'hotels'

export const firebaseHotelService = {
  async getAllHotels(): Promise<Hotel[]> {
    try {
      const hotelsRef = collection(db, HOTELS_COLLECTION)
      const q = query(hotelsRef, orderBy('created_at', 'desc'))
      const querySnapshot = await getDocs(q)

      const hotels: Hotel[] = []

      for (const docSnap of querySnapshot.docs) {
        const hotelData = docSnap.data()
        const hotelId = docSnap.id

        hotels.push({
          id: hotelId,
          name: hotelData.name || '',
          description: hotelData.description || '',
          price_per_night: hotelData.price_per_night || 0,
          category: hotelData.category || '',
          destination: hotelData.destination || '',
          amenities: hotelData.amenities || [],
          images: hotelData.images || [],
          rating: hotelData.rating || 0,
          total_reviews: hotelData.total_reviews || 0,
          is_active: hotelData.is_active ?? true,
          created_at: hotelData.created_at || new Date().toISOString(),
          updated_at: hotelData.updated_at || new Date().toISOString()
        })
      }

      return hotels
    } catch (error) {
      console.error('Error fetching hotels from Firebase:', error)
      return []
    }
  },

  async getHotelById(hotelId: string): Promise<Hotel | null> {
    try {
      const hotelRef = doc(db, HOTELS_COLLECTION, hotelId)
      const hotelSnap = await getDoc(hotelRef)

      if (!hotelSnap.exists()) {
        return null
      }

      const hotelData = hotelSnap.data()

      return {
        id: hotelId,
        name: hotelData.name || '',
        description: hotelData.description || '',
        price_per_night: hotelData.price_per_night || 0,
        category: hotelData.category || '',
        destination: hotelData.destination || '',
        amenities: hotelData.amenities || [],
        images: hotelData.images || [],
        rating: hotelData.rating || 0,
        total_reviews: hotelData.total_reviews || 0,
        is_active: hotelData.is_active ?? true,
        created_at: hotelData.created_at || new Date().toISOString(),
        updated_at: hotelData.updated_at || new Date().toISOString()
      }
    } catch (error) {
      console.error('Error fetching hotel by ID:', error)
      return null
    }
  },

  async createHotel(hotelData: Omit<Hotel, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, HOTELS_COLLECTION), {
        ...hotelData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      return docRef.id
    } catch (error) {
      console.error('Error creating hotel:', error)
      throw error
    }
  },

  async updateHotel(hotelId: string, updates: Partial<Hotel>): Promise<void> {
    try {
      const hotelRef = doc(db, HOTELS_COLLECTION, hotelId)
      await updateDoc(hotelRef, {
        ...updates,
        updated_at: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error updating hotel:', error)
      throw error
    }
  },

  async deleteHotel(hotelId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, HOTELS_COLLECTION, hotelId))
    } catch (error) {
      console.error('Error deleting hotel:', error)
      throw error
    }
  },
}
