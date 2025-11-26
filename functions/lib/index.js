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
exports.storeConversation = exports.getAvailabilityCalendar = exports.searchTours = exports.calculateTourPrice = exports.checkVehicleAvailability = exports.getNewsletterStats = exports.unsubscribeNewsletter = exports.subscribeNewsletter = exports.notifyBlogSubscribers = exports.sendNewsletterWelcome = exports.sendBookingReminders = exports.sendWelcomeEmail = exports.sendBookingNotification = exports.sendBookingConfirmation = exports.sendWhatsAppMessage = exports.sendEmail = void 0;
const admin = __importStar(require("firebase-admin"));
// Initialize Firebase Admin
admin.initializeApp();
// Import notification/email functions
var notifications_1 = require("./notifications");
Object.defineProperty(exports, "sendEmail", { enumerable: true, get: function () { return notifications_1.sendEmail; } });
Object.defineProperty(exports, "sendWhatsAppMessage", { enumerable: true, get: function () { return notifications_1.sendWhatsAppMessage; } });
Object.defineProperty(exports, "sendBookingConfirmation", { enumerable: true, get: function () { return notifications_1.sendBookingConfirmation; } });
Object.defineProperty(exports, "sendBookingNotification", { enumerable: true, get: function () { return notifications_1.sendBookingNotification; } });
Object.defineProperty(exports, "sendWelcomeEmail", { enumerable: true, get: function () { return notifications_1.sendWelcomeEmail; } });
Object.defineProperty(exports, "sendBookingReminders", { enumerable: true, get: function () { return notifications_1.sendBookingReminders; } });
Object.defineProperty(exports, "sendNewsletterWelcome", { enumerable: true, get: function () { return notifications_1.sendNewsletterWelcome; } });
Object.defineProperty(exports, "notifyBlogSubscribers", { enumerable: true, get: function () { return notifications_1.notifyBlogSubscribers; } });
Object.defineProperty(exports, "subscribeNewsletter", { enumerable: true, get: function () { return notifications_1.subscribeNewsletter; } });
Object.defineProperty(exports, "unsubscribeNewsletter", { enumerable: true, get: function () { return notifications_1.unsubscribeNewsletter; } });
Object.defineProperty(exports, "getNewsletterStats", { enumerable: true, get: function () { return notifications_1.getNewsletterStats; } });
// Import Yalu data functions
var yalu_data_functions_1 = require("./yalu-data-functions");
Object.defineProperty(exports, "checkVehicleAvailability", { enumerable: true, get: function () { return yalu_data_functions_1.checkVehicleAvailability; } });
Object.defineProperty(exports, "calculateTourPrice", { enumerable: true, get: function () { return yalu_data_functions_1.calculateTourPrice; } });
Object.defineProperty(exports, "searchTours", { enumerable: true, get: function () { return yalu_data_functions_1.searchTours; } });
Object.defineProperty(exports, "getAvailabilityCalendar", { enumerable: true, get: function () { return yalu_data_functions_1.getAvailabilityCalendar; } });
Object.defineProperty(exports, "storeConversation", { enumerable: true, get: function () { return yalu_data_functions_1.storeConversation; } });
//# sourceMappingURL=index.js.map