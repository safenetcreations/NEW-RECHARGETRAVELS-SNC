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
exports.healthCheck = exports.storeConversation = exports.getAvailabilityCalendar = exports.searchTours = exports.calculateTourPrice = exports.checkVehicleAvailability = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
// Initialize Firebase Admin
admin.initializeApp();
// Export all Yalu functions
var yalu_data_functions_1 = require("./yalu-data-functions");
Object.defineProperty(exports, "checkVehicleAvailability", { enumerable: true, get: function () { return yalu_data_functions_1.checkVehicleAvailability; } });
Object.defineProperty(exports, "calculateTourPrice", { enumerable: true, get: function () { return yalu_data_functions_1.calculateTourPrice; } });
Object.defineProperty(exports, "searchTours", { enumerable: true, get: function () { return yalu_data_functions_1.searchTours; } });
Object.defineProperty(exports, "getAvailabilityCalendar", { enumerable: true, get: function () { return yalu_data_functions_1.getAvailabilityCalendar; } });
Object.defineProperty(exports, "storeConversation", { enumerable: true, get: function () { return yalu_data_functions_1.storeConversation; } });
// Health check function
exports.healthCheck = functions.https.onRequest((req, res) => {
    res.status(200).json({
        status: 'healthy',
        service: 'Yalu AI Functions',
        timestamp: new Date().toISOString()
    });
});
//# sourceMappingURL=index.js.map