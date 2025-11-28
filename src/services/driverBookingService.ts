import {
  addDoc,
  collection,
  serverTimestamp
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { DriverAvailability } from '@/types/driver'

const DRIVER_ORDERS_COLLECTION = 'driver_orders'
const DRIVER_AVAILABILITY_COLLECTION = 'driver_availability'

interface DriverOrderPayload {
  driver_id: string
  booking_id: string
  customer_id?: string
  booking_type?: 'tour' | 'transport' | 'transfer' | 'full_day'
  pickup_date_time?: string
  dropoff_date_time?: string
  route_distance_km?: number
  total_amount?: number
  driver_commission?: number
  completion_status?: 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  notes?: string
}

export async function createDriverOrder(payload: DriverOrderPayload) {
  return addDoc(collection(db, DRIVER_ORDERS_COLLECTION), {
    ...payload,
    created_at: serverTimestamp()
  })
}

export async function blockDriverAvailability(entry: Omit<DriverAvailability, 'id'>) {
  return addDoc(collection(db, DRIVER_AVAILABILITY_COLLECTION), {
    ...entry,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp()
  })
}

/**
 * Convenience helper to assign a driver to a booking and immediately block availability.
 * Intended for admin/booking service usage.
 */
export async function assignDriverAndBlock(params: {
  driverId: string
  bookingId: string
  customerId?: string
  bookingType?: 'tour' | 'transport' | 'transfer' | 'full_day'
  startDate: string
  endDate?: string
  timeSlot?: 'morning' | 'afternoon' | 'evening' | 'full_day'
  totalAmount?: number
  driverCommission?: number
}) {
  const {
    driverId,
    bookingId,
    customerId,
    bookingType = 'tour',
    startDate,
    endDate,
    timeSlot = 'full_day',
    totalAmount,
    driverCommission
  } = params

  await createDriverOrder({
    driver_id: driverId,
    booking_id: bookingId,
    customer_id: customerId,
    booking_type: bookingType,
    pickup_date_time: startDate,
    dropoff_date_time: endDate,
    total_amount: totalAmount,
    driver_commission: driverCommission,
    completion_status: 'confirmed'
  })

  await blockDriverAvailability({
    driver_id: driverId,
    date: startDate.split('T')[0],
    time_slot: timeSlot,
    availability_status: 'booked',
    notes: `Auto-blocked for booking ${bookingId}`,
    auto_update_flag: true
  })
}
