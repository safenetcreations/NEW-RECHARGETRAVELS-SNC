import * as admin from 'firebase-admin';

// Initialize Firebase Admin
admin.initializeApp();

// Import notification/email functions
export {
  sendBookingConfirmation,
  sendAirportTransferConfirmation,
  sendBookingNotification,
  sendWelcomeEmail,
  sendBookingReminders,
  sendNewsletterWelcome,
  notifyBlogSubscribers,
  subscribeNewsletter,
  unsubscribeNewsletter,
  getNewsletterStats,
  sendEmail,
  // Train booking email & WhatsApp functions
  sendTrainBookingConfirmation,
  resendTrainBookingConfirmation,
  getTrainBookingWhatsAppLink,
  sendBeachToursBookingConfirmation,
  sendCulinaryBookingConfirmation,
  // Global Tour booking email & WhatsApp functions
  sendGlobalTourBookingConfirmation,
  resendGlobalTourBookingConfirmation,
  getGlobalTourBookingWhatsAppLink,
  // Email & WhatsApp queue processors
  processEmailQueue,
  processWhatsAppQueue
} from './notifications';

export { sendWhatsAppMessage } from './whatsapp';
export { createCheckoutSession, handleStripeWebhook } from './payments';

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

// B2B Portal API
export { b2bApi } from './b2b';

// News Aggregator - Scheduled functions for tourism news
export {
  morningNewsAggregator,
  eveningNewsAggregator,
  manualNewsFetch,
  getNewsSources,
  forceNewsRefresh,
  getNewsStats,
  clearAndRefreshNews
} from './newsAggregator';

// SEO & Indexing - Auto-submit to Google
export {
  generateNewsSitemap,
  pingSearchEngines,
  generateRobotsTxt,
  submitToIndexNow,
  dailySeoReport
} from './seoIndexing';

// Experience Content Seeder (temporary utility)
export { seedExperienceContent } from './seed-experiences';

// Prerender for SEO - serves static HTML to search engine bots
export { prerender, prerenderHealth } from './prerender';
