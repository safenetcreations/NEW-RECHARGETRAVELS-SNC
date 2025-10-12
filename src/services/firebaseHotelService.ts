import { db } from '@/lib/firebase'
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  orderBy,
  limit,
  DocumentData,
  QueryConstraint
} from 'firebase/firestore'
import { Hotel } from '@/types/hotel'

const HOTELS_COLLECTION = 'hotels'
const HOTEL_IMAGES_COLLECTION = 'hotel_images'
const HOTEL_REVIEWS_COLLECTION = 'hotel_reviews'
const ROOM_TYPES_COLLECTION = 'room_types'

export const firebaseHotelService = {
  async getAllHotels(): Promise<Hotel[]> {
    try {
      const hotelsRef = collection(db, HOTELS_COLLECTION)
      const constraints: QueryConstraint[] = [
        where('is_active', '==', true),
        where('country', '==', 'Sri Lanka'),
        orderBy('name')
      ]
      
      const q = query(hotelsRef, ...constraints)
      const querySnapshot = await getDocs(q)
      
      const hotels: Hotel[] = []
      
      for (const docSnap of querySnapshot.docs) {
        const hotelData = docSnap.data()
        const hotelId = docSnap.id
        
        // Fetch related data
        const images = await this.getHotelImages(hotelId)
        const reviews = await this.getHotelReviews(hotelId)
        const roomTypes = await this.getHotelRoomTypes(hotelId)
        
        hotels.push({
          id: hotelId,
          name: hotelData.name || '',
          description: hotelData.description || '',
          star_rating: hotelData.star_rating || 0,
          hotel_type: hotelData.hotel_type || 'budget',
          base_price_per_night: hotelData.base_price_per_night || 0,
          country: hotelData.country || 'Sri Lanka',
          latitude: hotelData.latitude,
          longitude: hotelData.longitude,
          address: hotelData.address || '',
          phone: hotelData.phone || '',
          amenities: Array.isArray(hotelData.amenities) ? hotelData.amenities : [],
          is_active: hotelData.is_active ?? true,
          created_at: hotelData.created_at || new Date().toISOString(),
          updated_at: hotelData.updated_at || new Date().toISOString(),
          city: hotelData.city,
          images,
          reviews,
          room_types: roomTypes
        })
      }
      
      return hotels
    } catch (error) {
      console.error('Error fetching hotels from Firebase:', error)
      return []
    }
  },

  async getHotelById(hotelId: string): Promise<Hotel | null> {
    try {
      const hotelRef = doc(db, HOTELS_COLLECTION, hotelId)
      const hotelSnap = await getDoc(hotelRef)
      
      if (!hotelSnap.exists()) {
        return null
      }
      
      const hotelData = hotelSnap.data()
      const images = await this.getHotelImages(hotelId)
      const reviews = await this.getHotelReviews(hotelId)
      const roomTypes = await this.getHotelRoomTypes(hotelId)
      
      return {
        id: hotelId,
        name: hotelData.name || '',
        description: hotelData.description || '',
        star_rating: hotelData.star_rating || 0,
        hotel_type: hotelData.hotel_type || 'budget',
        base_price_per_night: hotelData.base_price_per_night || 0,
        country: hotelData.country || 'Sri Lanka',
        latitude: hotelData.latitude,
        longitude: hotelData.longitude,
        address: hotelData.address || '',
        phone: hotelData.phone || '',
        amenities: Array.isArray(hotelData.amenities) ? hotelData.amenities : [],
        is_active: hotelData.is_active ?? true,
        created_at: hotelData.created_at || new Date().toISOString(),
        updated_at: hotelData.updated_at || new Date().toISOString(),
        city: hotelData.city,
        images,
        reviews,
        room_types: roomTypes
      }
    } catch (error) {
      console.error('Error fetching hotel by ID:', error)
      return null
    }
  },

  async getHotelImages(hotelId: string): Promise<any[]> {
    try {
      const imagesRef = collection(db, HOTEL_IMAGES_COLLECTION)
      const q = query(imagesRef, where('hotel_id', '==', hotelId), orderBy('display_order'))
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        hotel_id: hotelId,
        url: doc.data().url || '',
        caption: doc.data().caption || '',
        is_primary: doc.data().is_primary || false,
        display_order: doc.data().display_order || 0
      }))
    } catch (error) {
      console.error('Error fetching hotel images:', error)
      return []
    }
  },

  async getHotelReviews(hotelId: string): Promise<any[]> {
    try {
      const reviewsRef = collection(db, HOTEL_REVIEWS_COLLECTION)
      const q = query(
        reviewsRef, 
        where('hotel_id', '==', hotelId),
        where('is_published', '==', true),
        orderBy('created_at', 'desc'),
        limit(10)
      )
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (error) {
      console.error('Error fetching hotel reviews:', error)
      return []
    }
  },

  async getHotelRoomTypes(hotelId: string): Promise<any[]> {
    try {
      const roomTypesRef = collection(db, ROOM_TYPES_COLLECTION)
      const q = query(roomTypesRef, where('hotel_id', '==', hotelId))
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (error) {
      console.error('Error fetching room types:', error)
      return []
    }
  },

  async searchHotels(searchParams: {
    destination?: string
    minPrice?: number
    maxPrice?: number
    starRating?: number
    hotelType?: string
  }): Promise<Hotel[]> {
    try {
      const hotelsRef = collection(db, HOTELS_COLLECTION)
      const constraints: QueryConstraint[] = [
        where('is_active', '==', true),
        where('country', '==', 'Sri Lanka')
      ]
      
      if (searchParams.destination) {
        constraints.push(where('city.name', '==', searchParams.destination))
      }
      
      if (searchParams.starRating) {
        constraints.push(where('star_rating', '==', searchParams.starRating))
      }
      
      if (searchParams.hotelType) {
        constraints.push(where('hotel_type', '==', searchParams.hotelType))
      }
      
      const q = query(hotelsRef, ...constraints)
      const querySnapshot = await getDocs(q)
      
      let hotels = await Promise.all(
        querySnapshot.docs.map(async (docSnap) => {
          const hotelData = docSnap.data()
          const hotelId = docSnap.id
          
          const images = await this.getHotelImages(hotelId)
          const reviews = await this.getHotelReviews(hotelId)
          const roomTypes = await this.getHotelRoomTypes(hotelId)
          
          return {
            id: hotelId,
            name: hotelData.name || '',
            description: hotelData.description || '',
            star_rating: hotelData.star_rating || 0,
            hotel_type: hotelData.hotel_type || 'budget',
            base_price_per_night: hotelData.base_price_per_night || 0,
            country: hotelData.country || 'Sri Lanka',
            latitude: hotelData.latitude,
            longitude: hotelData.longitude,
            address: hotelData.address || '',
            phone: hotelData.phone || '',
            amenities: Array.isArray(hotelData.amenities) ? hotelData.amenities : [],
            is_active: hotelData.is_active ?? true,
            created_at: hotelData.created_at || new Date().toISOString(),
            updated_at: hotelData.updated_at || new Date().toISOString(),
            city: hotelData.city,
            images,
            reviews,
            room_types: roomTypes
          }
        })
      )
      
      // Apply price filters in memory since Firestore doesn't support range queries on different fields
      if (searchParams.minPrice !== undefined) {
        hotels = hotels.filter(h => h.base_price_per_night >= searchParams.minPrice!)
      }
      
      if (searchParams.maxPrice !== undefined) {
        hotels = hotels.filter(h => h.base_price_per_night <= searchParams.maxPrice!)
      }
      
      return hotels
    } catch (error) {
      console.error('Error searching hotels:', error)
      return []
    }
  },

  async createHotel(hotelData: Omit<Hotel, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, HOTELS_COLLECTION), {
        ...hotelData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      return docRef.id
    } catch (error) {
      console.error('Error creating hotel:', error)
      throw error
    }
  },

  async updateHotel(hotelId: string, updates: Partial<Hotel>): Promise<void> {
    try {
      const hotelRef = doc(db, HOTELS_COLLECTION, hotelId)
      await updateDoc(hotelRef, {
        ...updates,
        updated_at: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error updating hotel:', error)
      throw error
    }
  },

  async deleteHotel(hotelId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, HOTELS_COLLECTION, hotelId))
    } catch (error) {
      console.error('Error deleting hotel:', error)
      throw error
    }
  }
}