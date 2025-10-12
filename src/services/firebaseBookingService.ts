import { db } from '@/lib/firebase'
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore'
import { toast } from 'sonner'

export interface BookingData {
  booking_type: 'hotel_only' | 'tour_only' | 'transport' | 'package'
  hotel_id?: string
  tour_id?: string
  package_id?: string
  room_type_id?: string
  vehicle_id?: string
  
  // Dates
  check_in_date?: string
  check_out_date?: string
  tour_start_date?: string
  pickup_date?: string
  pickup_time?: string
  
  // Guest details
  adults: number
  children: number
  rooms?: number
  
  // Location details
  pickup_location?: string
  dropoff_location?: string
  destination?: string
  
  // Pricing
  total_price: number
  currency: string
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  payment_method?: string
  
  // Personal info
  personal_info: {
    firstName: string
    lastName: string
    email: string
    phone: string
    country?: string
  }
  
  // Additional details
  special_requests?: string
  add_ons?: string[]
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  
  // System fields
  user_id?: string
  confirmation_number?: string
  created_at?: any
  updated_at?: any
}

export interface Booking extends BookingData {
  id: string
  confirmation_number: string
  created_at: string
  updated_at: string
}

const BOOKINGS_COLLECTION = 'bookings'

export const firebaseBookingService = {
  generateConfirmationNumber(): string {
    const prefix = 'RT'
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `${prefix}-${timestamp}-${random}`
  },

  async createBooking(bookingData: BookingData): Promise<string> {
    try {
      const confirmationNumber = this.generateConfirmationNumber()
      
      const bookingDoc = {
        ...bookingData,
        confirmation_number: confirmationNumber,
        status: bookingData.status || 'pending',
        payment_status: bookingData.payment_status || 'pending',
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      }
      
      const docRef = await addDoc(collection(db, BOOKINGS_COLLECTION), bookingDoc)
      
      toast.success(`Booking created successfully! Confirmation: ${confirmationNumber}`)
      
      return docRef.id
    } catch (error) {
      console.error('Error creating booking:', error)
      toast.error('Failed to create booking. Please try again.')
      throw error
    }
  },

  async getBookingById(bookingId: string): Promise<Booking | null> {
    try {
      const bookingRef = doc(db, BOOKINGS_COLLECTION, bookingId)
      const bookingSnap = await getDoc(bookingRef)
      
      if (!bookingSnap.exists()) {
        return null
      }
      
      const data = bookingSnap.data()
      return {
        id: bookingSnap.id,
        ...data,
        created_at: data.created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
        updated_at: data.updated_at?.toDate?.()?.toISOString() || new Date().toISOString()
      } as Booking
    } catch (error) {
      console.error('Error fetching booking:', error)
      return null
    }
  },

  async getBookingByConfirmationNumber(confirmationNumber: string): Promise<Booking | null> {
    try {
      const bookingsRef = collection(db, BOOKINGS_COLLECTION)
      const q = query(bookingsRef, where('confirmation_number', '==', confirmationNumber))
      const querySnapshot = await getDocs(q)
      
      if (querySnapshot.empty) {
        return null
      }
      
      const bookingDoc = querySnapshot.docs[0]
      const data = bookingDoc.data()
      
      return {
        id: bookingDoc.id,
        ...data,
        created_at: data.created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
        updated_at: data.updated_at?.toDate?.()?.toISOString() || new Date().toISOString()
      } as Booking
    } catch (error) {
      console.error('Error fetching booking by confirmation number:', error)
      return null
    }
  },

  async getUserBookings(userId: string): Promise<Booking[]> {
    try {
      const bookingsRef = collection(db, BOOKINGS_COLLECTION)
      const q = query(
        bookingsRef,
        where('user_id', '==', userId),
        orderBy('created_at', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          created_at: data.created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
          updated_at: data.updated_at?.toDate?.()?.toISOString() || new Date().toISOString()
        } as Booking
      })
    } catch (error) {
      console.error('Error fetching user bookings:', error)
      return []
    }
  },

  async getBookingsByEmail(email: string): Promise<Booking[]> {
    try {
      const bookingsRef = collection(db, BOOKINGS_COLLECTION)
      const q = query(
        bookingsRef,
        where('personal_info.email', '==', email),
        orderBy('created_at', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          created_at: data.created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
          updated_at: data.updated_at?.toDate?.()?.toISOString() || new Date().toISOString()
        } as Booking
      })
    } catch (error) {
      console.error('Error fetching bookings by email:', error)
      return []
    }
  },

  async updateBooking(bookingId: string, updates: Partial<BookingData>): Promise<void> {
    try {
      const bookingRef = doc(db, BOOKINGS_COLLECTION, bookingId)
      await updateDoc(bookingRef, {
        ...updates,
        updated_at: serverTimestamp()
      })
      
      toast.success('Booking updated successfully')
    } catch (error) {
      console.error('Error updating booking:', error)
      toast.error('Failed to update booking')
      throw error
    }
  },

  async updateBookingStatus(bookingId: string, status: BookingData['status']): Promise<void> {
    try {
      await this.updateBooking(bookingId, { status })
    } catch (error) {
      console.error('Error updating booking status:', error)
      throw error
    }
  },

  async updatePaymentStatus(bookingId: string, paymentStatus: BookingData['payment_status'], paymentMethod?: string): Promise<void> {
    try {
      const updates: Partial<BookingData> = { payment_status: paymentStatus }
      if (paymentMethod) {
        updates.payment_method = paymentMethod
      }
      
      await this.updateBooking(bookingId, updates)
    } catch (error) {
      console.error('Error updating payment status:', error)
      throw error
    }
  },

  async getAllBookings(filters?: {
    status?: BookingData['status']
    booking_type?: BookingData['booking_type']
    startDate?: Date
    endDate?: Date
  }): Promise<Booking[]> {
    try {
      const bookingsRef = collection(db, BOOKINGS_COLLECTION)
      const constraints = []
      
      if (filters?.status) {
        constraints.push(where('status', '==', filters.status))
      }
      
      if (filters?.booking_type) {
        constraints.push(where('booking_type', '==', filters.booking_type))
      }
      
      constraints.push(orderBy('created_at', 'desc'))
      
      const q = query(bookingsRef, ...constraints)
      const querySnapshot = await getDocs(q)
      
      let bookings = querySnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          created_at: data.created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
          updated_at: data.updated_at?.toDate?.()?.toISOString() || new Date().toISOString()
        } as Booking
      })
      
      // Apply date filters in memory
      if (filters?.startDate) {
        bookings = bookings.filter(b => new Date(b.created_at) >= filters.startDate!)
      }
      
      if (filters?.endDate) {
        bookings = bookings.filter(b => new Date(b.created_at) <= filters.endDate!)
      }
      
      return bookings
    } catch (error) {
      console.error('Error fetching all bookings:', error)
      return []
    }
  },

  async cancelBooking(bookingId: string): Promise<void> {
    try {
      await this.updateBooking(bookingId, { 
        status: 'cancelled',
        payment_status: 'refunded'
      })
    } catch (error) {
      console.error('Error cancelling booking:', error)
      throw error
    }
  }
}