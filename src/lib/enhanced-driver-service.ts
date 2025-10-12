
import { dbService, authService, storageService } from '@/lib/firebase-services'
import type { DriverBooking, DriverBookingFormData, Customer } from '@/types/driver-booking'

// Re-export all functions from the specialized modules
export { 
  createEnhancedDriverBooking,
  getDriverBookings,
  updateBookingStatusWithNotes,
  shareWhatsAppContact,
  type EnhancedDriverBooking
} from './driver-booking-queries'

export { getOrCreateCustomer } from './customer-service'

export { 
  getDriversByVerificationStatus,
  updateDriverVerification
} from './driver-verification'
