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
exports.getTripAdvisorTours = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
if (!admin.apps.length) {
    admin.initializeApp();
}
exports.getTripAdvisorTours = functions.https.onCall(async (data, context) => {
    var _a, _b;
    try {
        const mode = (data === null || data === void 0 ? void 0 : data.mode) === 'live' ? 'live' : 'mock';
        const limit = typeof (data === null || data === void 0 ? void 0 : data.limit) === 'number' ? data.limit : 20;
        const operatorProfileUrl = (data === null || data === void 0 ? void 0 : data.operatorProfileUrl) ||
            'https://www.tripadvisor.com/Attraction_Review-g293962-d10049587-Reviews-Recharge_Travels_And_Tours-Colombo_Western_Province.html';
        const apiKey = ((_b = (_a = functions.config()) === null || _a === void 0 ? void 0 : _a.tripadvisor) === null || _b === void 0 ? void 0 : _b.apikey) ||
            process.env.TRIPADVISOR_API_KEY ||
            '';
        if (mode === 'live') {
            if (!apiKey) {
                console.error('TripAdvisor API key not configured');
                return {
                    success: false,
                    status: 'CONFIG_ERROR',
                    error: 'TripAdvisor API key not configured in functions config or environment variables'
                };
            }
            return {
                success: false,
                status: 'NOT_IMPLEMENTED',
                error: 'Live TripAdvisor API integration not implemented yet'
            };
        }
        return {
            success: true,
            status: 'MOCK_DATA',
            operatorProfileUrl,
            tours: [],
            limit
        };
    }
    catch (error) {
        console.error('TripAdvisor tours handler error:', error);
        return {
            success: false,
            status: 'INTERNAL_ERROR',
            error: (error === null || error === void 0 ? void 0 : error.message) || 'Unknown error'
        };
    }
});
//# sourceMappingURL=tripadvisor-tours.js.map