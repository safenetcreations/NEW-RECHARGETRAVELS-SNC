import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { firebaseBookingService, BookingData as FirebaseBookingData, Booking } from '@/services/firebaseBookingService'
import { toast } from 'sonner'

export interface BookingData {
  booking_type: 'hotel_only' | 'tour_only' | 'package'
  hotel_id?: string
  tour_id?: string
  package_id?: string
  room_type_id?: string
  check_in_date?: string
  check_out_date?: string
  tour_start_date?: string
  adults: number
  children: number
  rooms: number
  currency: string
  special_requests?: string
  add_ons: string[]
  personal_info: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  payment_data?: {
    method: string
    amount: number
  }
}

export type { Booking }

export const useBookingManager = () => {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [bookings, setBookings] = useState<Booking[]>([])

  const createBooking = async (bookingData: BookingData) => {
    if (!user) {
      toast.error("You must be logged in to make a booking")
      return { success: false, error: "Not authenticated" }
    }

    setIsLoading(true)
    try {
      const firebaseBookingData: FirebaseBookingData = {
        ...bookingData,
        user_id: user.uid,
        total_price: bookingData.payment_data?.amount || 0,
        payment_status: 'pending',
        status: 'pending'
      }

      const bookingId = await firebaseBookingService.createBooking(firebaseBookingData)
      const booking = await firebaseBookingService.getBookingById(bookingId)
      
      if (booking) {
        return { 
          success: true, 
          booking, 
          confirmation_number: booking.confirmation_number 
        }
      } else {
        return { success: false, error: 'Failed to retrieve booking after creation' }
      }
    } catch (error: any) {
      console.error('Booking creation error:', error)
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const getBooking = async (bookingId: string) => {
    setIsLoading(true)
    try {
      const booking = await firebaseBookingService.getBookingById(bookingId)
      
      if (booking) {
        return { success: true, booking }
      } else {
        return { success: false, error: 'Booking not found' }
      }
    } catch (error: any) {
      console.error('Get booking error:', error)
      toast.error('Failed to fetch booking')
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const getUserBookings = async () => {
    if (!user) return { success: false, error: "Not authenticated" }

    setIsLoading(true)
    try {
      const userBookings = await firebaseBookingService.getUserBookings(user.uid)
      setBookings(userBookings)
      return { success: true, bookings: userBookings }
    } catch (error: any) {
      console.error('Get user bookings error:', error)
      toast.error('Failed to fetch bookings')
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const cancelBooking = async (bookingId: string, reason?: string) => {
    setIsLoading(true)
    try {
      await firebaseBookingService.cancelBooking(bookingId)
      
      toast.success('Booking cancelled successfully')
      return { success: true }
    } catch (error: any) {
      console.error('Cancel booking error:', error)
      toast.error('Failed to cancel booking')
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const updatePaymentStatus = async (bookingId: string, status: 'pending' | 'paid' | 'failed' | 'refunded') => {
    setIsLoading(true)
    try {
      await firebaseBookingService.updatePaymentStatus(bookingId, status)
      
      toast.success('Payment status updated')
      return { success: true }
    } catch (error: any) {
      console.error('Update payment status error:', error)
      toast.error('Failed to update payment status')
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const getBookingByConfirmationNumber = async (confirmationNumber: string) => {
    setIsLoading(true)
    try {
      const booking = await firebaseBookingService.getBookingByConfirmationNumber(confirmationNumber)
      
      if (booking) {
        return { success: true, booking }
      } else {
        return { success: false, error: 'Booking not found' }
      }
    } catch (error: any) {
      console.error('Get booking by confirmation error:', error)
      toast.error('Failed to fetch booking')
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const checkAvailability = async (checkData: any) => {
    // For now, always return available
    // In the future, this should check actual availability
    return { 
      success: true, 
      availability: { 
        available: true, 
        message: 'Available for booking' 
      },
      error: null
    }
  }

  return {
    createBooking,
    getBooking,
    getUserBookings,
    cancelBooking,
    updatePaymentStatus,
    getBookingByConfirmationNumber,
    checkAvailability,
    bookings,
    isLoading
  }
}