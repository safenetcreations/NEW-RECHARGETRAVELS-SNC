"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prerender = exports.seedExperienceContent = exports.dailySeoReport = exports.submitToIndexNow = exports.generateRobotsTxt = exports.pingSearchEngines = exports.generateNewsSitemap = exports.clearAndRefreshNews = exports.getNewsStats = exports.forceNewsRefresh = exports.getNewsSources = exports.manualNewsFetch = exports.eveningNewsAggregator = exports.morningNewsAggregator = exports.b2bApi = exports.exportHotels = exports.bulkDeleteHotels = exports.bulkUpdateHotels = exports.bulkImportHotels = exports.getTripAdvisorTours = exports.googlePlacesApiHandler = exports.storeConversation = exports.getAvailabilityCalendar = exports.searchTours = exports.calculateTourPrice = exports.checkVehicleAvailability = exports.handleStripeWebhook = exports.createCheckoutSession = exports.sendWhatsAppMessage = exports.processWhatsAppQueue = exports.processEmailQueue = exports.getGlobalTourBookingWhatsAppLink = exports.resendGlobalTourBookingConfirmation = exports.sendGlobalTourBookingConfirmation = exports.sendCulinaryBookingConfirmation = exports.sendBeachToursBookingConfirmation = exports.getTrainBookingWhatsAppLink = exports.resendTrainBookingConfirmation = exports.sendTrainBookingConfirmation = exports.sendEmail = exports.getNewsletterStats = exports.unsubscribeNewsletter = exports.subscribeNewsletter = exports.notifyBlogSubscribers = exports.sendNewsletterWelcome = exports.sendBookingReminders = exports.sendWelcomeEmail = exports.sendBookingNotification = exports.sendAirportTransferConfirmation = exports.sendBookingConfirmation = void 0;
exports.prerenderHealth = void 0;
const admin = __importStar(require("firebase-admin"));
// Initialize Firebase Admin
admin.initializeApp();
// Import notification/email functions
var notifications_1 = require("./notifications");
Object.defineProperty(exports, "sendBookingConfirmation", { enumerable: true, get: function () { return notifications_1.sendBookingConfirmation; } });
Object.defineProperty(exports, "sendAirportTransferConfirmation", { enumerable: true, get: function () { return notifications_1.sendAirportTransferConfirmation; } });
Object.defineProperty(exports, "sendBookingNotification", { enumerable: true, get: function () { return notifications_1.sendBookingNotification; } });
Object.defineProperty(exports, "sendWelcomeEmail", { enumerable: true, get: function () { return notifications_1.sendWelcomeEmail; } });
Object.defineProperty(exports, "sendBookingReminders", { enumerable: true, get: function () { return notifications_1.sendBookingReminders; } });
Object.defineProperty(exports, "sendNewsletterWelcome", { enumerable: true, get: function () { return notifications_1.sendNewsletterWelcome; } });
Object.defineProperty(exports, "notifyBlogSubscribers", { enumerable: true, get: function () { return notifications_1.notifyBlogSubscribers; } });
Object.defineProperty(exports, "subscribeNewsletter", { enumerable: true, get: function () { return notifications_1.subscribeNewsletter; } });
Object.defineProperty(exports, "unsubscribeNewsletter", { enumerable: true, get: function () { return notifications_1.unsubscribeNewsletter; } });
Object.defineProperty(exports, "getNewsletterStats", { enumerable: true, get: function () { return notifications_1.getNewsletterStats; } });
Object.defineProperty(exports, "sendEmail", { enumerable: true, get: function () { return notifications_1.sendEmail; } });
// Train booking email & WhatsApp functions
Object.defineProperty(exports, "sendTrainBookingConfirmation", { enumerable: true, get: function () { return notifications_1.sendTrainBookingConfirmation; } });
Object.defineProperty(exports, "resendTrainBookingConfirmation", { enumerable: true, get: function () { return notifications_1.resendTrainBookingConfirmation; } });
Object.defineProperty(exports, "getTrainBookingWhatsAppLink", { enumerable: true, get: function () { return notifications_1.getTrainBookingWhatsAppLink; } });
Object.defineProperty(exports, "sendBeachToursBookingConfirmation", { enumerable: true, get: function () { return notifications_1.sendBeachToursBookingConfirmation; } });
Object.defineProperty(exports, "sendCulinaryBookingConfirmation", { enumerable: true, get: function () { return notifications_1.sendCulinaryBookingConfirmation; } });
// Global Tour booking email & WhatsApp functions
Object.defineProperty(exports, "sendGlobalTourBookingConfirmation", { enumerable: true, get: function () { return notifications_1.sendGlobalTourBookingConfirmation; } });
Object.defineProperty(exports, "resendGlobalTourBookingConfirmation", { enumerable: true, get: function () { return notifications_1.resendGlobalTourBookingConfirmation; } });
Object.defineProperty(exports, "getGlobalTourBookingWhatsAppLink", { enumerable: true, get: function () { return notifications_1.getGlobalTourBookingWhatsAppLink; } });
// Email & WhatsApp queue processors
Object.defineProperty(exports, "processEmailQueue", { enumerable: true, get: function () { return notifications_1.processEmailQueue; } });
Object.defineProperty(exports, "processWhatsAppQueue", { enumerable: true, get: function () { return notifications_1.processWhatsAppQueue; } });
var whatsapp_1 = require("./whatsapp");
Object.defineProperty(exports, "sendWhatsAppMessage", { enumerable: true, get: function () { return whatsapp_1.sendWhatsAppMessage; } });
var payments_1 = require("./payments");
Object.defineProperty(exports, "createCheckoutSession", { enumerable: true, get: function () { return payments_1.createCheckoutSession; } });
Object.defineProperty(exports, "handleStripeWebhook", { enumerable: true, get: function () { return payments_1.handleStripeWebhook; } });
// Import Yalu data functions
var yalu_data_functions_1 = require("./yalu-data-functions");
Object.defineProperty(exports, "checkVehicleAvailability", { enumerable: true, get: function () { return yalu_data_functions_1.checkVehicleAvailability; } });
Object.defineProperty(exports, "calculateTourPrice", { enumerable: true, get: function () { return yalu_data_functions_1.calculateTourPrice; } });
Object.defineProperty(exports, "searchTours", { enumerable: true, get: function () { return yalu_data_functions_1.searchTours; } });
Object.defineProperty(exports, "getAvailabilityCalendar", { enumerable: true, get: function () { return yalu_data_functions_1.getAvailabilityCalendar; } });
Object.defineProperty(exports, "storeConversation", { enumerable: true, get: function () { return yalu_data_functions_1.storeConversation; } });
// Import Google Places API handler
var google_places_api_handler_1 = require("./google-places-api-handler");
Object.defineProperty(exports, "googlePlacesApiHandler", { enumerable: true, get: function () { return google_places_api_handler_1.googlePlacesApiHandler; } });
var tripadvisor_tours_1 = require("./tripadvisor-tours");
Object.defineProperty(exports, "getTripAdvisorTours", { enumerable: true, get: function () { return tripadvisor_tours_1.getTripAdvisorTours; } });
// Import bulk operations
var bulk_operations_1 = require("./bulk-operations");
Object.defineProperty(exports, "bulkImportHotels", { enumerable: true, get: function () { return bulk_operations_1.bulkImportHotels; } });
Object.defineProperty(exports, "bulkUpdateHotels", { enumerable: true, get: function () { return bulk_operations_1.bulkUpdateHotels; } });
Object.defineProperty(exports, "bulkDeleteHotels", { enumerable: true, get: function () { return bulk_operations_1.bulkDeleteHotels; } });
Object.defineProperty(exports, "exportHotels", { enumerable: true, get: function () { return bulk_operations_1.exportHotels; } });
// B2B Portal API
var b2b_1 = require("./b2b");
Object.defineProperty(exports, "b2bApi", { enumerable: true, get: function () { return b2b_1.b2bApi; } });
// News Aggregator - Scheduled functions for tourism news
var newsAggregator_1 = require("./newsAggregator");
Object.defineProperty(exports, "morningNewsAggregator", { enumerable: true, get: function () { return newsAggregator_1.morningNewsAggregator; } });
Object.defineProperty(exports, "eveningNewsAggregator", { enumerable: true, get: function () { return newsAggregator_1.eveningNewsAggregator; } });
Object.defineProperty(exports, "manualNewsFetch", { enumerable: true, get: function () { return newsAggregator_1.manualNewsFetch; } });
Object.defineProperty(exports, "getNewsSources", { enumerable: true, get: function () { return newsAggregator_1.getNewsSources; } });
Object.defineProperty(exports, "forceNewsRefresh", { enumerable: true, get: function () { return newsAggregator_1.forceNewsRefresh; } });
Object.defineProperty(exports, "getNewsStats", { enumerable: true, get: function () { return newsAggregator_1.getNewsStats; } });
Object.defineProperty(exports, "clearAndRefreshNews", { enumerable: true, get: function () { return newsAggregator_1.clearAndRefreshNews; } });
// SEO & Indexing - Auto-submit to Google
var seoIndexing_1 = require("./seoIndexing");
Object.defineProperty(exports, "generateNewsSitemap", { enumerable: true, get: function () { return seoIndexing_1.generateNewsSitemap; } });
Object.defineProperty(exports, "pingSearchEngines", { enumerable: true, get: function () { return seoIndexing_1.pingSearchEngines; } });
Object.defineProperty(exports, "generateRobotsTxt", { enumerable: true, get: function () { return seoIndexing_1.generateRobotsTxt; } });
Object.defineProperty(exports, "submitToIndexNow", { enumerable: true, get: function () { return seoIndexing_1.submitToIndexNow; } });
Object.defineProperty(exports, "dailySeoReport", { enumerable: true, get: function () { return seoIndexing_1.dailySeoReport; } });
// Experience Content Seeder (temporary utility)
var seed_experiences_1 = require("./seed-experiences");
Object.defineProperty(exports, "seedExperienceContent", { enumerable: true, get: function () { return seed_experiences_1.seedExperienceContent; } });
// Prerender for SEO - serves static HTML to search engine bots
var prerender_1 = require("./prerender");
Object.defineProperty(exports, "prerender", { enumerable: true, get: function () { return prerender_1.prerender; } });
Object.defineProperty(exports, "prerenderHealth", { enumerable: true, get: function () { return prerender_1.prerenderHealth; } });
//# sourceMappingURL=index.js.map