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
  orderBy,
} from 'firebase/firestore'

export interface Activity {
  id: string
  name: string
  description: string
  price: number
  category: string
  destination: string
  createdAt: string
}

const ACTIVITIES_COLLECTION = 'activities'

export const firebaseActivityService = {
  async getAllActivities(): Promise<Activity[]> {
    try {
      const activitiesRef = collection(db, ACTIVITIES_COLLECTION)
      const q = query(activitiesRef, orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)

      const activities: Activity[] = []

      for (const docSnap of querySnapshot.docs) {
        const activityData = docSnap.data()
        const activityId = docSnap.id

        activities.push({
          id: activityId,
          name: activityData.name || '',
          description: activityData.description || '',
          price: activityData.price || 0,
          category: activityData.category || '',
          destination: activityData.destination || '',
          createdAt: activityData.createdAt || new Date().toISOString(),
        })
      }

      return activities
    } catch (error) {
      console.error('Error fetching activities from Firebase:', error)
      return []
    }
  },

  async getActivityById(activityId: string): Promise<Activity | null> {
    try {
      const activityRef = doc(db, ACTIVITIES_COLLECTION, activityId)
      const activitySnap = await getDoc(activityRef)

      if (!activitySnap.exists()) {
        return null
      }

      const activityData = activitySnap.data()

      return {
        id: activityId,
        name: activityData.name || '',
        description: activityData.description || '',
        price: activityData.price || 0,
        category: activityData.category || '',
        destination: activityData.destination || '',
        createdAt: activityData.createdAt || new Date().toISOString(),
      }
    } catch (error) {
      console.error('Error fetching activity by ID:', error)
      return null
    }
  },

  async createActivity(activityData: Omit<Activity, 'id' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, ACTIVITIES_COLLECTION), {
        ...activityData,
        createdAt: new Date().toISOString(),
      })
      return docRef.id
    } catch (error) {
      console.error('Error creating activity:', error)
      throw error
    }
  },

  async updateActivity(activityId: string, updates: Partial<Activity>): Promise<void> {
    try {
      const activityRef = doc(db, ACTIVITIES_COLLECTION, activityId)
      await updateDoc(activityRef, {
        ...updates,
      })
    } catch (error) {
      console.error('Error updating activity:', error)
      throw error
    }
  },

  async deleteActivity(activityId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, ACTIVITIES_COLLECTION, activityId))
    } catch (error) {
      console.error('Error deleting activity:', error)
      throw error
    }
  },
}
