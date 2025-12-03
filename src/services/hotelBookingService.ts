import { db } from '@/lib/firebase'
import { 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  runTransaction,
  increment
} from 'firebase/firestore'
import { getFunctions, httpsCallable } from 'firebase/functions'

const HOTEL_BOOKINGS_COLLECTION = 'hotel_bookings'
const COUNTERS_COLLECTION = 'counters'

export interface HotelBookingData {
  hotel_id: string
  hotel_name: string
  room_type_id: string
  room_type_name: string
  check_in: string
  check_out: string
  nights: number
  guests: {
    adults: number
    children: number
    rooms: number
  }
  guest_info: {
    first_name: string
    last_name: string
    email: string
    phone: string
    special_requests?: string
  }
  pricing: {
    room_rate_per_night: number
    subtotal: number
    tax: number
    service_fee: number
    total: number
    currency: string
  }
  payment_method: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'
}

export interface HotelBooking extends HotelBookingData {
  id: string
  booking_reference: string
  created_at: string
  updated_at: string
}

// Generate booking reference like HB-240001
const generateBookingReference = async (): Promise<string> => {
  const counterRef = doc(db, COUNTERS_COLLECTION, 'hotel_bookings')
  
  try {
    let newNumber = 1
    
    await runTransaction(db, async (transaction) => {
      const counterDoc = await transaction.get(counterRef)
      
      if (counterDoc.exists()) {
        newNumber = (counterDoc.data().current || 0) + 1
        transaction.update(counterRef, { current: newNumber })
      } else {
        transaction.set(counterRef, { current: 1 })
        newNumber = 1
      }
    })
    
    const year = new Date().getFullYear().toString().slice(-2)
    return `HB${year}${newNumber.toString().padStart(4, '0')}`
  } catch (error) {
    // Fallback to timestamp-based reference
    return `HB${Date.now().toString().slice(-8)}`
  }
}

export const hotelBookingService = {
  async createBooking(bookingData: HotelBookingData): Promise<HotelBooking> {
    try {
      const bookingReference = await generateBookingReference()
      
      const bookingDoc = {
        ...bookingData,
        booking_reference: bookingReference,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      const docRef = await addDoc(collection(db, HOTEL_BOOKINGS_COLLECTION), bookingDoc)
      
      // Send confirmation email via Cloud Function
      try {
        const functions = getFunctions()
        const sendHotelBookingEmail = httpsCallable(functions, 'sendHotelBookingEmail')
        await sendHotelBookingEmail({
          type: 'confirmation',
          bookingId: docRef.id,
          bookingReference,
          guestEmail: bookingData.guest_info.email,
          guestName: `${bookingData.guest_info.first_name} ${bookingData.guest_info.last_name}`,
          hotelName: bookingData.hotel_name,
          roomType: bookingData.room_type_name,
          checkIn: bookingData.check_in,
          checkOut: bookingData.check_out,
          nights: bookingData.nights,
          totalAmount: bookingData.pricing.total,
          currency: bookingData.pricing.currency
        })
      } catch (emailError) {
        console.warn('Failed to send confirmation email:', emailError)
      }
      
      return {
        ...bookingDoc,
        id: docRef.id
      }
    } catch (error) {
      console.error('Error creating hotel booking:', error)
      throw error
    }
  },

  async getBookingById(bookingId: string): Promise<HotelBooking | null> {
    try {
      const bookingRef = doc(db, HOTEL_BOOKINGS_COLLECTION, bookingId)
      const bookingSnap = await getDoc(bookingRef)
      
      if (!bookingSnap.exists()) {
        return null
      }
      
      return {
        id: bookingSnap.id,
        ...bookingSnap.data()
      } as HotelBooking
    } catch (error) {
      console.error('Error fetching booking:', error)
      return null
    }
  },

  async getBookingByReference(reference: string): Promise<HotelBooking | null> {
    try {
      const q = query(
        collection(db, HOTEL_BOOKINGS_COLLECTION),
        where('booking_reference', '==', reference)
      )
      const snapshot = await getDocs(q)
      
      if (snapshot.empty) {
        return null
      }
      
      const doc = snapshot.docs[0]
      return {
        id: doc.id,
        ...doc.data()
      } as HotelBooking
    } catch (error) {
      console.error('Error fetching booking by reference:', error)
      return null
    }
  },

  async getBookingsByEmail(email: string): Promise<HotelBooking[]> {
    try {
      const q = query(
        collection(db, HOTEL_BOOKINGS_COLLECTION),
        where('guest_info.email', '==', email),
        orderBy('created_at', 'desc')
      )
      const snapshot = await getDocs(q)
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as HotelBooking[]
    } catch (error) {
      console.error('Error fetching bookings by email:', error)
      return []
    }
  },

  async getAllBookings(): Promise<HotelBooking[]> {
    try {
      const q = query(
        collection(db, HOTEL_BOOKINGS_COLLECTION),
        orderBy('created_at', 'desc')
      )
      const snapshot = await getDocs(q)
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as HotelBooking[]
    } catch (error) {
      console.error('Error fetching all bookings:', error)
      return []
    }
  },

  async updateBookingStatus(bookingId: string, status: HotelBooking['status']): Promise<void> {
    try {
      const bookingRef = doc(db, HOTEL_BOOKINGS_COLLECTION, bookingId)
      await updateDoc(bookingRef, {
        status,
        updated_at: new Date().toISOString()
      })
      
      // Send status update email
      if (status === 'cancelled') {
        const booking = await this.getBookingById(bookingId)
        if (booking) {
          try {
            const functions = getFunctions()
            const sendHotelBookingEmail = httpsCallable(functions, 'sendHotelBookingEmail')
            await sendHotelBookingEmail({
              type: 'cancellation',
              bookingId,
              bookingReference: booking.booking_reference,
              guestEmail: booking.guest_info.email,
              guestName: `${booking.guest_info.first_name} ${booking.guest_info.last_name}`,
              hotelName: booking.hotel_name
            })
          } catch (emailError) {
            console.warn('Failed to send cancellation email:', emailError)
          }
        }
      }
    } catch (error) {
      console.error('Error updating booking status:', error)
      throw error
    }
  },

  async cancelBooking(bookingId: string, reason?: string): Promise<void> {
    try {
      const bookingRef = doc(db, HOTEL_BOOKINGS_COLLECTION, bookingId)
      await updateDoc(bookingRef, {
        status: 'cancelled',
        cancellation_reason: reason || 'Cancelled by user',
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error cancelling booking:', error)
      throw error
    }
  },

  // Admin stats
  async getBookingStats(): Promise<{
    total: number
    pending: number
    confirmed: number
    cancelled: number
    completed: number
    revenue: number
  }> {
    try {
      const snapshot = await getDocs(collection(db, HOTEL_BOOKINGS_COLLECTION))
      
      const stats = {
        total: 0,
        pending: 0,
        confirmed: 0,
        cancelled: 0,
        completed: 0,
        revenue: 0
      }
      
      snapshot.forEach(doc => {
        const data = doc.data()
        stats.total++
        
        switch (data.status) {
          case 'pending': stats.pending++; break
          case 'confirmed': 
            stats.confirmed++
            stats.revenue += data.pricing?.total || 0
            break
          case 'cancelled': stats.cancelled++; break
          case 'completed': 
            stats.completed++
            stats.revenue += data.pricing?.total || 0
            break
        }
      })
      
      return stats
    } catch (error) {
      console.error('Error fetching booking stats:', error)
      return { total: 0, pending: 0, confirmed: 0, cancelled: 0, completed: 0, revenue: 0 }
    }
  }
}

export default hotelBookingService
