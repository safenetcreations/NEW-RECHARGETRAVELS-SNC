import * as admin from 'firebase-admin';

// Initialize Firebase Admin
admin.initializeApp();

// Import all functions
export { dailyContentAutomation } from './contentAutomation';
export { 
  generateBlogContent,
  generateSEOContent,
  scheduleSocialPost
} from './contentGeneration';
export {
  sendEmail,
  sendWhatsAppMessage,
  sendBookingConfirmation,
  sendBookingNotification
} from './notifications';
export {
  calculatePrice,
  processBooking,
  bookingManagement
} from './bookings';
export {
  getAnalyticsReport
} from './analytics';
export {
  searchLocations,
  getHotelData,
  getTourData
} from './apiHandlers';