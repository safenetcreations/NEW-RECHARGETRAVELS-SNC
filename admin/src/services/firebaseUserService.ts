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

export interface User {
  id: string
  displayName: string
  email: string
  photoURL: string
  role: string
  createdAt: string
}

const USERS_COLLECTION = 'users'

export const firebaseUserService = {
  async getAllUsers(): Promise<User[]> {
    try {
      const usersRef = collection(db, USERS_COLLECTION)
      const q = query(usersRef, orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)

      const users: User[] = []

      for (const docSnap of querySnapshot.docs) {
        const userData = docSnap.data()
        const userId = docSnap.id

        users.push({
          id: userId,
          displayName: userData.displayName || '',
          email: userData.email || '',
          photoURL: userData.photoURL || '',
          role: userData.role || 'user',
          createdAt: userData.createdAt || new Date().toISOString(),
        })
      }

      return users
    } catch (error) {
      console.error('Error fetching users from Firebase:', error)
      return []
    }
  },

  async getUserById(userId: string): Promise<User | null> {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId)
      const userSnap = await getDoc(userRef)

      if (!userSnap.exists()) {
        return null
      }

      const userData = userSnap.data()

      return {
        id: userId,
        displayName: userData.displayName || '',
        email: userData.email || '',
        photoURL: userData.photoURL || '',
        role: userData.role || 'user',
        createdAt: userData.createdAt || new Date().toISOString(),
      }
    } catch (error) {
      console.error('Error fetching user by ID:', error)
      return null
    }
  },

  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, USERS_COLLECTION), {
        ...userData,
        createdAt: new Date().toISOString(),
      })
      return docRef.id
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  },

  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId)
      await updateDoc(userRef, {
        ...updates,
      })
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  },

  async deleteUser(userId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, USERS_COLLECTION, userId))
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error
    }
  },
}
