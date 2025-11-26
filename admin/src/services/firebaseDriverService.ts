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

export interface Driver {
  id: string
  name: string
  email: string
  phone: string
  licenseNumber: string
  vehicle: string
  createdAt: string
}

const DRIVERS_COLLECTION = 'drivers'

export const firebaseDriverService = {
  async getAllDrivers(): Promise<Driver[]> {
    try {
      const driversRef = collection(db, DRIVERS_COLLECTION)
      const q = query(driversRef, orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)

      const drivers: Driver[] = []

      for (const docSnap of querySnapshot.docs) {
        const driverData = docSnap.data()
        const driverId = docSnap.id

        drivers.push({
          id: driverId,
          name: driverData.name || '',
          email: driverData.email || '',
          phone: driverData.phone || '',
          licenseNumber: driverData.licenseNumber || '',
          vehicle: driverData.vehicle || '',
          createdAt: driverData.createdAt || new Date().toISOString(),
        })
      }

      return drivers
    } catch (error) {
      console.error('Error fetching drivers from Firebase:', error)
      return []
    }
  },

  async getDriverById(driverId: string): Promise<Driver | null> {
    try {
      const driverRef = doc(db, DRIVERS_COLLECTION, driverId)
      const driverSnap = await getDoc(driverRef)

      if (!driverSnap.exists()) {
        return null
      }

      const driverData = driverSnap.data()

      return {
        id: driverId,
        name: driverData.name || '',
        email: driverData.email || '',
        phone: driverData.phone || '',
        licenseNumber: driverData.licenseNumber || '',
        vehicle: driverData.vehicle || '',
        createdAt: driverData.createdAt || new Date().toISOString(),
      }
    } catch (error) {
      console.error('Error fetching driver by ID:', error)
      return null
    }
  },

  async createDriver(driverData: Omit<Driver, 'id' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, DRIVERS_COLLECTION), {
        ...driverData,
        createdAt: new Date().toISOString(),
      })
      return docRef.id
    } catch (error) {
      console.error('Error creating driver:', error)
      throw error
    }
  },

  async updateDriver(driverId: string, updates: Partial<Driver>): Promise<void> {
    try {
      const driverRef = doc(db, DRIVERS_COLLECTION, driverId)
      await updateDoc(driverRef, {
        ...updates,
      })
    } catch (error) {
      console.error('Error updating driver:', error)
      throw error
    }
  },

  async deleteDriver(driverId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, DRIVERS_COLLECTION, driverId))
    } catch (error) {
      console.error('Error deleting driver:', error)
      throw error
    }
  },
}
