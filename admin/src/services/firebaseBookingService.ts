import { db } from '@/lib/firebase'
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore'

export interface Booking {
  id: string
  userId: string
  tourId: string
  hotelId: string
  bookingDate: string
  status: string
  totalPrice: number
  createdAt: string
  updatedAt: string
}

const BOOKINGS_COLLECTION = 'bookings'

export const firebaseBookingService = {
  async getAllBookings(): Promise<Booking[]> {
    try {
      const bookingsRef = collection(db, BOOKINGS_COLLECTION)
      const q = query(bookingsRef, orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)

      const bookings: Booking[] = []

      for (const docSnap of querySnapshot.docs) {
        const bookingData = docSnap.data()
        const bookingId = docSnap.id

        bookings.push({
          id: bookingId,
          userId: bookingData.userId || '',
          tourId: bookingData.tourId || '',
          hotelId: bookingData.hotelId || '',
          bookingDate: bookingData.bookingDate || '',
          status: bookingData.status || '',
          totalPrice: bookingData.totalPrice || 0,
          createdAt: bookingData.createdAt || new Date().toISOString(),
          updatedAt: bookingData.updatedAt || new Date().toISOString()
        })
      }

      return bookings
    } catch (error) {
      console.error('Error fetching bookings from Firebase:', error)
      return []
    }
  },

  async getBookingById(bookingId: string): Promise<Booking | null> {
    try {
      const bookingRef = doc(db, BOOKINGS_COLLECTION, bookingId)
      const bookingSnap = await getDoc(bookingRef)

      if (!bookingSnap.exists()) {
        return null
      }

      const bookingData = bookingSnap.data()

      return {
        id: bookingId,
        userId: bookingData.userId || '',
        tourId: bookingData.tourId || '',
        hotelId: bookingData.hotelId || '',
        bookingDate: bookingData.bookingDate || '',
        status: bookingData.status || '',
        totalPrice: bookingData.totalPrice || 0,
        createdAt: bookingData.createdAt || new Date().toISOString(),
        updatedAt: bookingData.updatedAt || new Date().toISOString()
      }
    } catch (error) {
      console.error('Error fetching booking by ID:', error)
      return null
    }
  },

  async createBooking(bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, BOOKINGS_COLLECTION), {
        ...bookingData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      return docRef.id
    } catch (error) {
      console.error('Error creating booking:', error)
      throw error
    }
  },

  async updateBooking(bookingId: string, updates: Partial<Booking>): Promise<void> {
    try {
      const bookingRef = doc(db, BOOKINGS_COLLECTION, bookingId)
      await updateDoc(bookingRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error updating booking:', error)
      throw error
    }
  },

  async deleteBooking(bookingId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, BOOKINGS_COLLECTION, bookingId))
    } catch (error) {
      console.error('Error deleting booking:', error)
      throw error
    }
  },
}
