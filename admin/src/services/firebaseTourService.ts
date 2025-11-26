import { db, storage } from '@/lib/firebase'
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
  QueryConstraint
} from 'firebase/firestore'

export interface Tour {
  id: string
  title: string
  description: string
  duration_days: number
  price_per_person: number
  category: string
  destination: string
  difficulty_level?: string
  max_group_size?: number
  included_items?: string[]
  excluded_items?: string[]
  itinerary?: any[]
  images?: any[]
  rating?: number
  total_reviews?: number
  is_active: boolean
  created_at: string
  updated_at: string
}

const TOURS_COLLECTION = 'tours'
const TOUR_IMAGES_COLLECTION = 'tour_images'
const TOUR_REVIEWS_COLLECTION = 'tour_reviews'

export const firebaseTourService = {
  // Get all tours (including inactive for admin)
  async getAllTours(): Promise<Tour[]> {
    try {
      const toursRef = collection(db, TOURS_COLLECTION)
      const q = query(toursRef, orderBy('created_at', 'desc'))
      const querySnapshot = await getDocs(q)

      const tours: Tour[] = []

      for (const docSnap of querySnapshot.docs) {
        const tourData = docSnap.data()
        const tourId = docSnap.id

        const images = await this.getTourImages(tourId)
        const reviews = await this.getTourReviews(tourId)

        tours.push({
          id: tourId,
          title: tourData.title || '',
          description: tourData.description || '',
          duration_days: tourData.duration_days || 1,
          price_per_person: tourData.price_per_person || 0,
          category: tourData.category || '',
          destination: tourData.destination || '',
          difficulty_level: tourData.difficulty_level,
          max_group_size: tourData.max_group_size,
          included_items: tourData.included_items || [],
          excluded_items: tourData.excluded_items || [],
          itinerary: tourData.itinerary || [],
          images,
          rating: tourData.rating || 0,
          total_reviews: reviews.length,
          is_active: tourData.is_active ?? true,
          created_at: tourData.created_at || new Date().toISOString(),
          updated_at: tourData.updated_at || new Date().toISOString()
        })
      }

      return tours
    } catch (error) {
      console.error('Error fetching tours from Firebase:', error)
      return []
    }
  },

  // Get tour by ID
  async getTourById(tourId: string): Promise<Tour | null> {
    try {
      const tourRef = doc(db, TOURS_COLLECTION, tourId)
      const tourSnap = await getDoc(tourRef)

      if (!tourSnap.exists()) {
        return null
      }

      const tourData = tourSnap.data()
      const images = await this.getTourImages(tourId)
      const reviews = await this.getTourReviews(tourId)

      return {
        id: tourId,
        title: tourData.title || '',
        description: tourData.description || '',
        duration_days: tourData.duration_days || 1,
        price_per_person: tourData.price_per_person || 0,
        category: tourData.category || '',
        destination: tourData.destination || '',
        difficulty_level: tourData.difficulty_level,
        max_group_size: tourData.max_group_size,
        included_items: tourData.included_items || [],
        excluded_items: tourData.excluded_items || [],
        itinerary: tourData.itinerary || [],
        images,
        rating: tourData.rating || 0,
        total_reviews: reviews.length,
        is_active: tourData.is_active ?? true,
        created_at: tourData.created_at || new Date().toISOString(),
        updated_at: tourData.updated_at || new Date().toISOString()
      }
    } catch (error) {
      console.error('Error fetching tour by ID:', error)
      return null
    }
  },

  // Get tour images
  async getTourImages(tourId: string): Promise<any[]> {
    try {
      const imagesRef = collection(db, TOUR_IMAGES_COLLECTION)
      const q = query(imagesRef, where('tour_id', '==', tourId), orderBy('display_order'))
      const querySnapshot = await getDocs(q)

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        tour_id: tourId,
        url: doc.data().url || '',
        caption: doc.data().caption || '',
        is_primary: doc.data().is_primary || false,
        display_order: doc.data().display_order || 0
      }))
    } catch (error) {
      console.error('Error fetching tour images:', error)
      return []
    }
  },

  // Get tour reviews
  async getTourReviews(tourId: string): Promise<any[]> {
    try {
      const reviewsRef = collection(db, TOUR_REVIEWS_COLLECTION)
      const q = query(
        reviewsRef,
        where('tour_id', '==', tourId),
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
      console.error('Error fetching tour reviews:', error)
      return []
    }
  },

  // Create new tour
  async createTour(tourData: Omit<Tour, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, TOURS_COLLECTION), {
        ...tourData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      return docRef.id
    } catch (error) {
      console.error('Error creating tour:', error)
      throw error
    }
  },

  // Update existing tour
  async updateTour(tourId: string, updates: Partial<Tour>): Promise<void> {
    try {
      const tourRef = doc(db, TOURS_COLLECTION, tourId)
      await updateDoc(tourRef, {
        ...updates,
        updated_at: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error updating tour:', error)
      throw error
    }
  },

  // Delete tour
  async deleteTour(tourId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, TOURS_COLLECTION, tourId))
    } catch (error) {
      console.error('Error deleting tour:', error)
      throw error
    }
  },

  // Search tours
  async searchTours(searchParams: {
    category?: string
    destination?: string
    minPrice?: number
    maxPrice?: number
    duration?: string
    difficulty?: string
  }): Promise<Tour[]> {
    try {
      const toursRef = collection(db, TOURS_COLLECTION)
      const constraints: QueryConstraint[] = []

      if (searchParams.category && searchParams.category !== 'all') {
        constraints.push(where('category', '==', searchParams.category))
      }

      if (searchParams.destination) {
        constraints.push(where('destination', '==', searchParams.destination))
      }

      if (searchParams.difficulty) {
        constraints.push(where('difficulty_level', '==', searchParams.difficulty))
      }

      const q = query(toursRef, ...constraints)
      const querySnapshot = await getDocs(q)

      let tours = await Promise.all(
        querySnapshot.docs.map(async (docSnap) => {
          const tourData = docSnap.data()
          const tourId = docSnap.id

          const images = await this.getTourImages(tourId)
          const reviews = await this.getTourReviews(tourId)

          return {
            id: tourId,
            title: tourData.title || '',
            description: tourData.description || '',
            duration_days: tourData.duration_days || 1,
            price_per_person: tourData.price_per_person || 0,
            category: tourData.category || '',
            destination: tourData.destination || '',
            difficulty_level: tourData.difficulty_level,
            max_group_size: tourData.max_group_size,
            included_items: tourData.included_items || [],
            excluded_items: tourData.excluded_items || [],
            itinerary: tourData.itinerary || [],
            images,
            rating: tourData.rating || 0,
            total_reviews: reviews.length,
            is_active: tourData.is_active ?? true,
            created_at: tourData.created_at || new Date().toISOString(),
            updated_at: tourData.updated_at || new Date().toISOString()
          }
        })
      )

      // Apply price filters in memory
      if (searchParams.minPrice !== undefined) {
        tours = tours.filter(t => t.price_per_person >= searchParams.minPrice!)
      }

      if (searchParams.maxPrice !== undefined) {
        tours = tours.filter(t => t.price_per_person <= searchParams.maxPrice!)
      }

      return tours
    } catch (error) {
      console.error('Error searching tours:', error)
      return []
    }
  }
}
