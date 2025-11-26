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
exports.storeConversation = exports.getAvailabilityCalendar = exports.searchTours = exports.calculateTourPrice = exports.checkVehicleAvailability = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
// Initialize Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();
// Vehicle availability check
exports.checkVehicleAvailability = functions.https.onCall(async (data, context) => {
    try {
        const { date, category, passengers = 1 } = data;
        // Query vehicles collection
        let query = db.collection('vehicles')
            .where('isActive', '==', true)
            .where('capacity', '>=', passengers);
        if (category) {
            query = query.where('category', '==', category);
        }
        const vehiclesSnapshot = await query.get();
        const vehicles = [];
        // Check bookings for each vehicle
        for (const doc of vehiclesSnapshot.docs) {
            const vehicleData = doc.data();
            const vehicle = Object.assign({ id: doc.id }, vehicleData);
            // Check if vehicle is booked on the requested date
            const bookingsSnapshot = await db.collection('bookings')
                .where('vehicleId', '==', doc.id)
                .where('date', '==', date)
                .where('status', 'in', ['confirmed', 'pending'])
                .get();
            if (bookingsSnapshot.empty) {
                vehicles.push(Object.assign(Object.assign({}, vehicle), { available: true, pricePerDay: vehicle.pricePerDay || 0 }));
            }
        }
        return {
            success: true,
            available: vehicles.length > 0,
            vehicles,
            date,
            totalAvailable: vehicles.length
        };
    }
    catch (error) {
        console.error('Vehicle availability check error:', error);
        return {
            success: false,
            error: (error === null || error === void 0 ? void 0 : error.message) || 'Unknown error',
            available: false,
            vehicles: []
        };
    }
});
// Calculate tour pricing
exports.calculateTourPrice = functions.https.onCall(async (data, context) => {
    try {
        const { tourId, pax, date } = data;
        // Get tour details
        const tourDoc = await db.collection('tours').doc(tourId).get();
        if (!tourDoc.exists) {
            throw new Error('Tour not found');
        }
        const tour = tourDoc.data();
        const basePrice = (tour === null || tour === void 0 ? void 0 : tour.pricePerPerson) || 0;
        // Calculate group discounts
        let discount = 0;
        if (pax >= 10)
            discount = 0.15; // 15% for 10+ people
        else if (pax >= 6)
            discount = 0.10; // 10% for 6+ people
        else if (pax >= 4)
            discount = 0.05; // 5% for 4+ people
        // Check for seasonal pricing
        const month = new Date(date).getMonth();
        const isPeakSeason = [11, 0, 1, 2, 3].includes(month); // Dec-Apr peak season
        const seasonalMultiplier = isPeakSeason ? 1.2 : 1.0;
        // Calculate final price
        const subtotal = basePrice * pax * seasonalMultiplier;
        const discountAmount = subtotal * discount;
        const totalPrice = subtotal - discountAmount;
        return {
            success: true,
            tourId,
            tourName: tour === null || tour === void 0 ? void 0 : tour.name,
            pax,
            basePrice,
            subtotal,
            discount: discount * 100,
            discountAmount,
            totalPrice,
            currency: 'LKR',
            includes: (tour === null || tour === void 0 ? void 0 : tour.includes) || [],
            seasonalPricing: isPeakSeason,
            validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        };
    }
    catch (error) {
        console.error('Tour price calculation error:', error);
        return {
            success: false,
            error: (error === null || error === void 0 ? void 0 : error.message) || 'Unknown error',
            tourId: data.tourId,
            pax: data.pax,
            totalPrice: 0
        };
    }
});
// Search tours function
exports.searchTours = functions.https.onCall(async (data, context) => {
    try {
        const { query, category, maxPrice, minRating = 0 } = data;
        let toursQuery = db.collection('tours')
            .where('isActive', '==', true)
            .where('rating', '>=', minRating);
        if (category && category !== 'all') {
            toursQuery = toursQuery.where('category', '==', category);
        }
        if (maxPrice) {
            toursQuery = toursQuery.where('pricePerPerson', '<=', maxPrice);
        }
        const toursSnapshot = await toursQuery.limit(20).get();
        const tours = [];
        // Search in tour names and descriptions
        const searchTerms = query.toLowerCase().split(' ');
        toursSnapshot.forEach(doc => {
            const tourData = doc.data();
            const tour = Object.assign({ id: doc.id }, tourData);
            const searchableText = `${tour.name || ''} ${tour.description || ''} ${(tour.highlights || []).join(' ')}`.toLowerCase();
            // Check if any search term matches
            const matches = searchTerms.some((term) => searchableText.includes(term));
            if (matches || !query) {
                tours.push({
                    id: doc.id,
                    name: tour.name || '',
                    description: tour.description || '',
                    category: tour.category || '',
                    pricePerPerson: tour.pricePerPerson || 0,
                    duration: tour.duration || '',
                    rating: tour.rating || 4.5,
                    images: tour.images || [],
                    highlights: tour.highlights || []
                });
            }
        });
        // Sort by relevance (basic scoring)
        tours.sort((a, b) => {
            const aScore = searchTerms.filter((term) => (a.name || '').toLowerCase().includes(term)).length;
            const bScore = searchTerms.filter((term) => (b.name || '').toLowerCase().includes(term)).length;
            return bScore - aScore;
        });
        return {
            success: true,
            results: tours.slice(0, 10),
            total: tours.length,
            query,
            category
        };
    }
    catch (error) {
        console.error('Tour search error:', error);
        return {
            success: false,
            error: (error === null || error === void 0 ? void 0 : error.message) || 'Unknown error',
            results: [],
            total: 0
        };
    }
});
// Get live availability calendar
exports.getAvailabilityCalendar = functions.https.onCall(async (data, context) => {
    try {
        const { resourceType, resourceId, month, year } = data;
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        // Query bookings for the month
        const bookingsSnapshot = await db.collection('bookings')
            .where('resourceType', '==', resourceType)
            .where('resourceId', '==', resourceId)
            .where('date', '>=', startDate.toISOString().split('T')[0])
            .where('date', '<=', endDate.toISOString().split('T')[0])
            .where('status', 'in', ['confirmed', 'pending'])
            .get();
        const bookedDates = new Set();
        bookingsSnapshot.forEach(doc => {
            bookedDates.add(doc.data().date);
        });
        // Generate calendar data
        const calendar = [];
        for (let day = 1; day <= endDate.getDate(); day++) {
            const date = new Date(year, month - 1, day);
            const dateStr = date.toISOString().split('T')[0];
            calendar.push({
                date: dateStr,
                available: !bookedDates.has(dateStr),
                dayOfWeek: date.getDay()
            });
        }
        return {
            success: true,
            resourceType,
            resourceId,
            month,
            year,
            calendar
        };
    }
    catch (error) {
        console.error('Availability calendar error:', error);
        return {
            success: false,
            error: (error === null || error === void 0 ? void 0 : error.message) || 'Unknown error',
            calendar: []
        };
    }
});
// Store user conversation for memory
exports.storeConversation = functions.https.onCall(async (data, context) => {
    try {
        const { sessionId, userId, messages, language, metadata } = data;
        const conversation = {
            sessionId,
            userId: userId || 'anonymous',
            messages,
            language,
            metadata,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            date: new Date().toISOString().split('T')[0]
        };
        await db.collection('yalu_conversations').add(conversation);
        // Extract and store user preferences
        if (userId) {
            const preferences = extractPreferences(messages);
            if (Object.keys(preferences).length > 0) {
                await db.collection('user_preferences').doc(userId).set(preferences, { merge: true });
            }
        }
        return {
            success: true,
            sessionId,
            stored: true
        };
    }
    catch (error) {
        console.error('Store conversation error:', error);
        return {
            success: false,
            error: (error === null || error === void 0 ? void 0 : error.message) || 'Unknown error'
        };
    }
});
// Helper function to extract preferences from conversation
function extractPreferences(messages) {
    const preferences = {};
    messages.forEach(msg => {
        const text = msg.content.toLowerCase();
        // Extract budget preferences
        if (text.includes('budget') || text.includes('cheap') || text.includes('luxury')) {
            if (text.includes('budget') || text.includes('cheap')) {
                preferences.budgetLevel = 'budget';
            }
            else if (text.includes('luxury')) {
                preferences.budgetLevel = 'luxury';
            }
        }
        // Extract interest preferences
        if (text.includes('beach'))
            preferences.interests = [...(preferences.interests || []), 'beaches'];
        if (text.includes('wildlife') || text.includes('safari'))
            preferences.interests = [...(preferences.interests || []), 'wildlife'];
        if (text.includes('culture') || text.includes('temple'))
            preferences.interests = [...(preferences.interests || []), 'culture'];
        if (text.includes('adventure'))
            preferences.interests = [...(preferences.interests || []), 'adventure'];
        // Extract travel style
        if (text.includes('family'))
            preferences.travelStyle = 'family';
        if (text.includes('honeymoon') || text.includes('romantic'))
            preferences.travelStyle = 'romantic';
        if (text.includes('backpack'))
            preferences.travelStyle = 'backpacker';
    });
    // Remove duplicates from interests
    if (preferences.interests) {
        preferences.interests = [...new Set(preferences.interests)];
    }
    return preferences;
}
//# sourceMappingURL=yalu-data-functions.js.map