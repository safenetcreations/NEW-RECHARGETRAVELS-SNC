import * as admin from 'firebase-admin';

// Initialize Firebase Admin
admin.initializeApp();

// Import notification/email functions
export {
  sendEmail,
  sendWhatsAppMessage,
  sendBookingConfirmation,
  sendBookingNotification,
  sendWelcomeEmail,
  sendBookingReminders,
  sendNewsletterWelcome,
  notifyBlogSubscribers,
  subscribeNewsletter,
  unsubscribeNewsletter,
  getNewsletterStats
} from './notifications';

// Import Yalu data functions
export {
  checkVehicleAvailability,
  calculateTourPrice,
  searchTours,
  getAvailabilityCalendar,
  storeConversation
} from './yalu-data-functions';

// Import Google Places API handler
export { googlePlacesApiHandler } from './google-places-api-handler';

export { getTripAdvisorTours } from './tripadvisor-tours';

// Import bulk operations
export {
  bulkImportHotels,
  bulkUpdateHotels,
  bulkDeleteHotels,
  exportHotels
} from './bulk-operations';