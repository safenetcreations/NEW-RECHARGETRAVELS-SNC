import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp()
}

const db = admin.firestore()

// Bulk import hotels from CSV/JSON
export const bulkImportHotels = functions.https.onCall(async (data, context) => {
  // Check if user is authenticated and has admin privileges
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated')
  }

  // TODO: Add admin role check
  // if (!context.auth.token.admin) {
  //   throw new functions.https.HttpsError('permission-denied', 'Admin privileges required')
  // }

  try {
    const { hotels, format = 'json', options = {} } = data

    if (!hotels || !Array.isArray(hotels)) {
      throw new functions.https.HttpsError('invalid-argument', 'Hotels array is required')
    }

    console.log(`📥 Starting bulk import of ${hotels.length} hotels`)

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
      imported: [] as any[]
    }

    // Process hotels in batches to avoid Firestore limits
    const batchSize = 10
    const batches = []

    for (let i = 0; i < hotels.length; i += batchSize) {
      batches.push(hotels.slice(i, i + batchSize))
    }

    for (const batch of batches) {
      const batchPromises = batch.map(async (hotelData: any) => {
        try {
          // Validate and transform hotel data
          const validatedHotel = validateAndTransformHotel(hotelData, format)

          // Check if hotel already exists
          const existingQuery = await db.collection('hotels')
            .where('name', '==', validatedHotel.name)
            .where('address', '==', validatedHotel.address)
            .limit(1)
            .get()

          let hotelRef
          if (!existingQuery.empty && !options.overwrite) {
            // Skip existing hotels unless overwrite is enabled
            console.log(`⏭️ Skipping existing hotel: ${validatedHotel.name}`)
            return { skipped: true, name: validatedHotel.name }
          } else if (!existingQuery.empty && options.overwrite) {
            // Update existing hotel
            hotelRef = existingQuery.docs[0].ref
            await hotelRef.update({
              ...validatedHotel,
              updated_at: admin.firestore.FieldValue.serverTimestamp()
            })
            console.log(`✏️ Updated hotel: ${validatedHotel.name}`)
          } else {
            // Create new hotel
            hotelRef = db.collection('hotels').doc()
            await hotelRef.set({
              ...validatedHotel,
              id: hotelRef.id,
              created_at: admin.firestore.FieldValue.serverTimestamp(),
              updated_at: admin.firestore.FieldValue.serverTimestamp()
            })
            console.log(`✅ Created hotel: ${validatedHotel.name}`)
          }

          results.success++
          results.imported.push({
            id: hotelRef.id,
            name: validatedHotel.name,
            status: existingQuery.empty ? 'created' : 'updated'
          })

          return { success: true, id: hotelRef.id, name: validatedHotel.name }

        } catch (error: any) {
          console.error(`❌ Failed to import hotel:`, hotelData, error)
          results.failed++
          results.errors.push(`Failed to import ${hotelData.name || 'unknown hotel'}: ${error.message}`)
          return { success: false, error: error.message, data: hotelData }
        }
      })

      // Wait for batch to complete
      await Promise.all(batchPromises)
    }

    console.log(`📊 Bulk import completed: ${results.success} success, ${results.failed} failed`)

    return {
      success: true,
      results,
      summary: {
        total: hotels.length,
        imported: results.success,
        failed: results.failed,
        skipped: hotels.length - results.success - results.failed
      }
    }

  } catch (error: any) {
    console.error('❌ Bulk import error:', error)
    throw new functions.https.HttpsError('internal', error.message)
  }
})

// Bulk update hotels
export const bulkUpdateHotels = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated')
  }

  try {
    const { hotelIds, updates } = data

    if (!hotelIds || !Array.isArray(hotelIds) || !updates) {
      throw new functions.https.HttpsError('invalid-argument', 'Hotel IDs array and updates are required')
    }

    console.log(`📝 Starting bulk update of ${hotelIds.length} hotels`)

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[]
    }

    // Process updates in batches
    const batchSize = 10
    const batches = []

    for (let i = 0; i < hotelIds.length; i += batchSize) {
      batches.push(hotelIds.slice(i, i + batchSize))
    }

    for (const batch of batches) {
      const batchPromises = batch.map(async (hotelId: string) => {
        try {
          const hotelRef = db.collection('hotels').doc(hotelId)
          await hotelRef.update({
            ...updates,
            updated_at: admin.firestore.FieldValue.serverTimestamp()
          })

          results.success++
          return { success: true, id: hotelId }

        } catch (error: any) {
          console.error(`❌ Failed to update hotel ${hotelId}:`, error)
          results.failed++
          results.errors.push(`Failed to update hotel ${hotelId}: ${error.message}`)
          return { success: false, error: error.message, id: hotelId }
        }
      })

      await Promise.all(batchPromises)
    }

    console.log(`📊 Bulk update completed: ${results.success} success, ${results.failed} failed`)

    return {
      success: true,
      results,
      summary: {
        total: hotelIds.length,
        updated: results.success,
        failed: results.failed
      }
    }

  } catch (error: any) {
    console.error('❌ Bulk update error:', error)
    throw new functions.https.HttpsError('internal', error.message)
  }
})

// Bulk delete hotels
export const bulkDeleteHotels = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated')
  }

  try {
    const { hotelIds } = data

    if (!hotelIds || !Array.isArray(hotelIds)) {
      throw new functions.https.HttpsError('invalid-argument', 'Hotel IDs array is required')
    }

    console.log(`🗑️ Starting bulk delete of ${hotelIds.length} hotels`)

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[]
    }

    // Process deletions in batches
    const batchSize = 10
    const batches = []

    for (let i = 0; i < hotelIds.length; i += batchSize) {
      batches.push(hotelIds.slice(i, i + batchSize))
    }

    for (const batch of batches) {
      const batchPromises = batch.map(async (hotelId: string) => {
        try {
          await db.collection('hotels').doc(hotelId).delete()
          results.success++
          return { success: true, id: hotelId }

        } catch (error: any) {
          console.error(`❌ Failed to delete hotel ${hotelId}:`, error)
          results.failed++
          results.errors.push(`Failed to delete hotel ${hotelId}: ${error.message}`)
          return { success: false, error: error.message, id: hotelId }
        }
      })

      await Promise.all(batchPromises)
    }

    console.log(`📊 Bulk delete completed: ${results.success} success, ${results.failed} failed`)

    return {
      success: true,
      results,
      summary: {
        total: hotelIds.length,
        deleted: results.success,
        failed: results.failed
      }
    }

  } catch (error: any) {
    console.error('❌ Bulk delete error:', error)
    throw new functions.https.HttpsError('internal', error.message)
  }
})

// Export hotels data
export const exportHotels = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated')
  }

  try {
    const { format = 'json', filters = {} } = data

    console.log(`📤 Starting hotel export in ${format} format`)

    // Start with base query
    let query: any = db.collection('hotels')

    // Apply filters one by one
    if (filters.starRating && filters.starRating.length > 0) {
      query = query.where('star_rating', 'in', filters.starRating)
    }

    if (filters.isActive !== undefined) {
      query = query.where('is_active', '==', filters.isActive)
    }

    if (filters.city) {
      query = query.where('city.name', '==', filters.city)
    }

    const snapshot = await query.get()
    const hotels = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    console.log(`📊 Exported ${hotels.length} hotels`)

    if (format === 'csv') {
      const csvData = convertToCSV(hotels)
      return {
        success: true,
        data: csvData,
        format: 'csv',
        count: hotels.length
      }
    } else {
      return {
        success: true,
        data: hotels,
        format: 'json',
        count: hotels.length
      }
    }

  } catch (error: any) {
    console.error('❌ Export error:', error)
    throw new functions.https.HttpsError('internal', error.message)
  }
})

// Helper function to validate and transform hotel data
function validateAndTransformHotel(hotelData: any, format: string) {
  const hotel: any = {}

  // Basic validation and transformation
  hotel.name = hotelData.name || hotelData.Name || ''
  hotel.description = hotelData.description || hotelData.Description || ''
  hotel.address = hotelData.address || hotelData.Address || ''
  hotel.star_rating = parseInt(hotelData.star_rating || hotelData['Star Rating'] || hotelData.starRating || 3)
  hotel.base_price_per_night = parseFloat(hotelData.base_price_per_night || hotelData['Base Price'] || hotelData.basePrice || 0)
  hotel.is_active = hotelData.is_active !== undefined ? hotelData.is_active : true
  hotel.average_rating = parseFloat(hotelData.average_rating || hotelData['Average Rating'] || 0)
  hotel.review_count = parseInt(hotelData.review_count || hotelData['Review Count'] || 0)

  // Handle amenities
  if (hotelData.amenities) {
    if (typeof hotelData.amenities === 'string') {
      hotel.amenities = hotelData.amenities.split(',').map((a: string) => a.trim())
    } else if (Array.isArray(hotelData.amenities)) {
      hotel.amenities = hotelData.amenities
    } else {
      hotel.amenities = []
    }
  } else {
    hotel.amenities = []
  }

  // Handle city
  if (hotelData.city) {
    if (typeof hotelData.city === 'string') {
      hotel.city = { name: hotelData.city, country: 'Sri Lanka' }
    } else {
      hotel.city = hotelData.city
    }
  } else {
    hotel.city = { name: 'Unknown', country: 'Sri Lanka' }
  }

  // Handle images
  if (hotelData.images) {
    if (typeof hotelData.images === 'string') {
      hotel.images = [{ image_url: hotelData.images, is_primary: true }]
    } else if (Array.isArray(hotelData.images)) {
      hotel.images = hotelData.images
    } else {
      hotel.images = []
    }
  } else {
    hotel.images = []
  }

  // Set hotel type based on star rating or amenities
  if (hotel.star_rating >= 5) {
    hotel.hotel_type = 'luxury_resort'
  } else if (hotel.star_rating >= 4) {
    hotel.hotel_type = 'business'
  } else if (hotel.star_rating >= 3) {
    hotel.hotel_type = 'boutique'
  } else {
    hotel.hotel_type = 'budget'
  }

  return hotel
}

// Helper function to convert data to CSV
function convertToCSV(data: any[]): string {
  if (data.length === 0) return ''

  const headers = Object.keys(data[0])
  const csvRows = []

  // Add headers
  csvRows.push(headers.join(','))

  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header]
      if (typeof value === 'object') {
        return JSON.stringify(value).replace(/"/g, '""')
      }
      return String(value || '').replace(/"/g, '""')
    })
    csvRows.push(values.join(','))
  }

  return csvRows.join('\n')
}