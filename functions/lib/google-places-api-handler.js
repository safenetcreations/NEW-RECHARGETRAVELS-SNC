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
exports.googlePlacesApiHandler = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
// Initialize Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();
// Google Places API Handler
exports.googlePlacesApiHandler = functions.https.onCall(async (data, context) => {
    var _a, _b, _c;
    try {
        const { action, params } = data;
        // Get API key from environment variables
        const apiKey = ((_b = (_a = functions.config()) === null || _a === void 0 ? void 0 : _a.google_maps) === null || _b === void 0 ? void 0 : _b.api_key) ||
            process.env.GOOGLE_MAPS_API_KEY ||
            process.env.VITE_GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
            console.error('❌ Google Maps API key not found');
            return {
                success: false,
                error: 'Google Maps API key not configured',
                status: 'CONFIG_ERROR'
            };
        }
        console.log(`🔍 Google Places API ${action} request:`, params);
        let apiUrl = '';
        let requestBody = {};
        switch (action) {
            case 'autocomplete':
                apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(params.input)}&key=${apiKey}&components=country:lk`;
                if (params.types) {
                    apiUrl += `&types=${params.types}`;
                }
                if ((_c = params.componentRestrictions) === null || _c === void 0 ? void 0 : _c.country) {
                    apiUrl += `&components=country:${params.componentRestrictions.country}`;
                }
                break;
            case 'place_details':
                apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${params.place_id}&key=${apiKey}`;
                if (params.fields) {
                    apiUrl += `&fields=${params.fields}`;
                }
                break;
            case 'text_search':
                apiUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(params.query)}&key=${apiKey}&components=country:lk`;
                if (params.location) {
                    apiUrl += `&location=${params.location}`;
                }
                if (params.radius) {
                    apiUrl += `&radius=${params.radius}`;
                }
                break;
            case 'nearby_search':
                apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${params.location}&key=${apiKey}&components=country:lk`;
                if (params.radius) {
                    apiUrl += `&radius=${params.radius}`;
                }
                if (params.type) {
                    apiUrl += `&type=${params.type}`;
                }
                break;
            default:
                return {
                    success: false,
                    error: `Unknown action: ${action}`,
                    status: 'INVALID_ACTION'
                };
        }
        console.log(`🌐 Making request to: ${apiUrl}`);
        // Make the API request
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const result = await response.json();
        console.log(`📊 Google Places API response status: ${result.status}`);
        if (result.status === 'OK' || result.status === 'ZERO_RESULTS') {
            return {
                success: true,
                data: result,
                status: result.status
            };
        }
        else {
            console.error(`❌ Google Places API error: ${result.status}`, result.error_message);
            return {
                success: false,
                error: result.error_message || `Google Places API returned status: ${result.status}`,
                status: result.status,
                data: result
            };
        }
    }
    catch (error) {
        console.error('❌ Google Places API handler error:', error);
        return {
            success: false,
            error: (error === null || error === void 0 ? void 0 : error.message) || 'Unknown error occurred',
            status: 'INTERNAL_ERROR'
        };
    }
});
//# sourceMappingURL=google-places-api-handler.js.map