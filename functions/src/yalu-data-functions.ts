import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp()
}

const db = admin.firestore()

// Vehicle availability check
export const checkVehicleAvailability = functions.https.onCall(async (data, context) => {
  try {
    const { date, category, passengers = 1 } = data
    
    // Query vehicles collection
    let query = db.collection('vehicles')
      .where('isActive', '==', true)
      .where('capacity', '>=', passengers)
    
    if (category) {
      query = query.where('category', '==', category)
    }
    
    const vehiclesSnapshot = await query.get()
    const vehicles = []
    
    // Check bookings for each vehicle
    for (const doc of vehiclesSnapshot.docs) {
      const vehicleData = doc.data() as any
      const vehicle = { id: doc.id, ...vehicleData }
      
      // Check if vehicle is booked on the requested date
      const bookingsSnapshot = await db.collection('bookings')
        .where('vehicleId', '==', doc.id)
        .where('date', '==', date)
        .where('status', 'in', ['confirmed', 'pending'])
        .get()
      
      if (bookingsSnapshot.empty) {
        vehicles.push({
          ...vehicle,
          available: true,
          pricePerDay: vehicle.pricePerDay || 0
        })
      }
    }
    
    return {
      success: true,
      available: vehicles.length > 0,
      vehicles,
      date,
      totalAvailable: vehicles.length
    }
    
  } catch (error: any) {
    console.error('Vehicle availability check error:', error)
    return {
      success: false,
      error: error?.message || 'Unknown error',
      available: false,
      vehicles: []
    }
  }
})

// Calculate tour pricing
export const calculateTourPrice = functions.https.onCall(async (data, context) => {
  try {
    const { tourId, pax, date } = data
    
    // Get tour details
    const tourDoc = await db.collection('tours').doc(tourId).get()
    
    if (!tourDoc.exists) {
      throw new Error('Tour not found')
    }
    
    const tour = tourDoc.data() as any
    const basePrice = tour?.pricePerPerson || 0
    
    // Calculate group discounts
    let discount = 0
    if (pax >= 10) discount = 0.15      // 15% for 10+ people
    else if (pax >= 6) discount = 0.10  // 10% for 6+ people
    else if (pax >= 4) discount = 0.05  // 5% for 4+ people
    
    // Check for seasonal pricing
    const month = new Date(date).getMonth()
    const isPeakSeason = [11, 0, 1, 2, 3].includes(month) // Dec-Apr peak season
    const seasonalMultiplier = isPeakSeason ? 1.2 : 1.0
    
    // Calculate final price
    const subtotal = basePrice * pax * seasonalMultiplier
    const discountAmount = subtotal * discount
    const totalPrice = subtotal - discountAmount
    
    return {
      success: true,
      tourId,
      tourName: tour?.name,
      pax,
      basePrice,
      subtotal,
      discount: discount * 100,
      discountAmount,
      totalPrice,
      currency: 'LKR',
      includes: tour?.includes || [],
      seasonalPricing: isPeakSeason,
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    }
    
  } catch (error: any) {
    console.error('Tour price calculation error:', error)
    return {
      success: false,
      error: error?.message || 'Unknown error',
      tourId: data.tourId,
      pax: data.pax,
      totalPrice: 0
    }
  }
})

// Search tours function
export const searchTours = functions.https.onCall(async (data, context) => {
  try {
    const { query, category, maxPrice, minRating = 0 } = data
    
    let toursQuery = db.collection('tours')
      .where('isActive', '==', true)
      .where('rating', '>=', minRating)
    
    if (category && category !== 'all') {
      toursQuery = toursQuery.where('category', '==', category)
    }
    
    if (maxPrice) {
      toursQuery = toursQuery.where('pricePerPerson', '<=', maxPrice)
    }
    
    const toursSnapshot = await toursQuery.limit(20).get()
    const tours: any[] = []

    // Search in tour names and descriptions
    const searchTerms = query.toLowerCase().split(' ')

    toursSnapshot.forEach(doc => {
      const tourData = doc.data() as any
      const tour = { id: doc.id, ...tourData }
      const searchableText = `${tour.name || ''} ${tour.description || ''} ${(tour.highlights || []).join(' ')}`.toLowerCase()

      // Check if any search term matches
      const matches = searchTerms.some((term: string) => searchableText.includes(term))

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
        })
      }
    })

    // Sort by relevance (basic scoring)
    tours.sort((a: any, b: any) => {
      const aScore = searchTerms.filter((term: string) =>
        (a.name || '').toLowerCase().includes(term)
      ).length
      const bScore = searchTerms.filter((term: string) =>
        (b.name || '').toLowerCase().includes(term)
      ).length
      return bScore - aScore
    })

    return {
      success: true,
      results: tours.slice(0, 10),
      total: tours.length,
      query,
      category
    }
    
  } catch (error: any) {
    console.error('Tour search error:', error)
    return {
      success: false,
      error: error?.message || 'Unknown error',
      results: [],
      total: 0
    }
  }
})

// Get live availability calendar
export const getAvailabilityCalendar = functions.https.onCall(async (data, context) => {
  try {
    const { resourceType, resourceId, month, year } = data
    
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)
    
    // Query bookings for the month
    const bookingsSnapshot = await db.collection('bookings')
      .where('resourceType', '==', resourceType)
      .where('resourceId', '==', resourceId)
      .where('date', '>=', startDate.toISOString().split('T')[0])
      .where('date', '<=', endDate.toISOString().split('T')[0])
      .where('status', 'in', ['confirmed', 'pending'])
      .get()
    
    const bookedDates = new Set()
    bookingsSnapshot.forEach(doc => {
      bookedDates.add(doc.data().date)
    })
    
    // Generate calendar data
    const calendar = []
    for (let day = 1; day <= endDate.getDate(); day++) {
      const date = new Date(year, month - 1, day)
      const dateStr = date.toISOString().split('T')[0]
      
      calendar.push({
        date: dateStr,
        available: !bookedDates.has(dateStr),
        dayOfWeek: date.getDay()
      })
    }
    
    return {
      success: true,
      resourceType,
      resourceId,
      month,
      year,
      calendar
    }
    
  } catch (error: any) {
    console.error('Availability calendar error:', error)
    return {
      success: false,
      error: error?.message || 'Unknown error',
      calendar: []
    }
  }
})

// Store user conversation for memory
export const storeConversation = functions.https.onCall(async (data, context) => {
  try {
    const { sessionId, userId, messages, language, metadata } = data
    
    const conversation = {
      sessionId,
      userId: userId || 'anonymous',
      messages,
      language,
      metadata,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      date: new Date().toISOString().split('T')[0]
    }
    
    await db.collection('yalu_conversations').add(conversation)
    
    // Extract and store user preferences
    if (userId) {
      const preferences = extractPreferences(messages)
      if (Object.keys(preferences).length > 0) {
        await db.collection('user_preferences').doc(userId).set(
          preferences,
          { merge: true }
        )
      }
    }
    
    return {
      success: true,
      sessionId,
      stored: true
    }
    
  } catch (error: any) {
    console.error('Store conversation error:', error)
    return {
      success: false,
      error: error?.message || 'Unknown error'
    }
  }
})

// Helper function to extract preferences from conversation
function extractPreferences(messages: any[]) {
  const preferences: any = {}
  
  messages.forEach(msg => {
    const text = msg.content.toLowerCase()
    
    // Extract budget preferences
    if (text.includes('budget') || text.includes('cheap') || text.includes('luxury')) {
      if (text.includes('budget') || text.includes('cheap')) {
        preferences.budgetLevel = 'budget'
      } else if (text.includes('luxury')) {
        preferences.budgetLevel = 'luxury'
      }
    }
    
    // Extract interest preferences
    if (text.includes('beach')) preferences.interests = [...(preferences.interests || []), 'beaches']
    if (text.includes('wildlife') || text.includes('safari')) preferences.interests = [...(preferences.interests || []), 'wildlife']
    if (text.includes('culture') || text.includes('temple')) preferences.interests = [...(preferences.interests || []), 'culture']
    if (text.includes('adventure')) preferences.interests = [...(preferences.interests || []), 'adventure']
    
    // Extract travel style
    if (text.includes('family')) preferences.travelStyle = 'family'
    if (text.includes('honeymoon') || text.includes('romantic')) preferences.travelStyle = 'romantic'
    if (text.includes('backpack')) preferences.travelStyle = 'backpacker'
  })
  
  // Remove duplicates from interests
  if (preferences.interests) {
    preferences.interests = [...new Set(preferences.interests)]
  }
  
  return preferences
}