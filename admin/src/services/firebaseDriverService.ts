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
  orderBy,
  where,
  Timestamp,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export type DriverStatus = 'incomplete' | 'pending_verification' | 'verified' | 'suspended' | 'inactive';
export type DriverTier = 'chauffeur_guide' | 'national_guide' | 'tourist_driver' | 'freelance_driver';
export type VehicleType = 'sedan' | 'suv' | 'van' | 'mini_coach' | 'luxury';

export interface Driver {
  id: string;
  user_id?: string;
  full_name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  tier: DriverTier;

  // Licenses & Documents
  sltda_license_number?: string;
  sltda_license_expiry?: string;
  drivers_license_number?: string;
  drivers_license_expiry?: string;
  national_id_number?: string;
  police_clearance_expiry?: string;

  // Experience & Status
  years_experience?: number;
  current_status: DriverStatus;
  is_sltda_approved?: boolean;
  is_guide?: boolean;
  is_chauffeur?: boolean;

  // Profile
  biography?: string;
  specialty_languages?: string[];
  profile_photo?: string;
  profile_photos?: string[]; // Multiple profile photos (up to 5)
  cover_image?: string;

  // Vehicle Info
  vehicle_type?: VehicleType;
  vehicle_make_model?: string;
  vehicle_registration?: string;
  vehicle_year?: number;
  vehicle_capacity?: number;
  vehicle_ac?: boolean;
  vehicle_wifi?: boolean;
  vehicle_photo?: string;
  vehicle_photos?: string[]; // Multiple vehicle photos
  vehicle_preference?: 'own_vehicle' | 'company_vehicle';

  // Rates
  hourly_rate?: number;
  daily_rate?: number;
  airport_rate?: number;
  per_km_rate?: number;

  // Ratings & Reviews
  average_rating?: number;
  total_reviews?: number;
  completion_rate?: number;

  // Social
  social_insta?: string;
  social_facebook?: string;

  // Timestamps
  created_at?: string;
  updated_at?: string;
}

const DRIVERS_COLLECTION = 'drivers'

export const firebaseDriverService = {
  async getAllDrivers(): Promise<Driver[]> {
    try {
      const driversRef = collection(db, DRIVERS_COLLECTION)
      const q = query(driversRef, orderBy('created_at', 'desc'))
      const querySnapshot = await getDocs(q)

      const drivers: Driver[] = []

      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data()
        drivers.push({
          id: docSnap.id,
          user_id: data.user_id || '',
          full_name: data.full_name || data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          whatsapp: data.whatsapp || '',
          tier: data.tier || 'freelance_driver',
          sltda_license_number: data.sltda_license_number || '',
          sltda_license_expiry: data.sltda_license_expiry || '',
          drivers_license_number: data.drivers_license_number || data.licenseNumber || '',
          drivers_license_expiry: data.drivers_license_expiry || '',
          national_id_number: data.national_id_number || '',
          police_clearance_expiry: data.police_clearance_expiry || '',
          years_experience: data.years_experience || 0,
          current_status: data.current_status || 'pending_verification',
          is_sltda_approved: data.is_sltda_approved || false,
          is_guide: data.is_guide || false,
          is_chauffeur: data.is_chauffeur || false,
          biography: data.biography || '',
          specialty_languages: data.specialty_languages || ['English'],
          profile_photo: data.profile_photo || '',
          cover_image: data.cover_image || '',
          vehicle_type: data.vehicle_type || 'sedan',
          vehicle_make_model: data.vehicle_make_model || data.vehicle || '',
          vehicle_registration: data.vehicle_registration || '',
          vehicle_year: data.vehicle_year || new Date().getFullYear(),
          vehicle_capacity: data.vehicle_capacity || 4,
          vehicle_ac: data.vehicle_ac ?? true,
          vehicle_wifi: data.vehicle_wifi || false,
          vehicle_photo: data.vehicle_photo || '',
          vehicle_preference: data.vehicle_preference || 'own_vehicle',
          hourly_rate: data.hourly_rate || 0,
          daily_rate: data.daily_rate || 0,
          airport_rate: data.airport_rate || 0,
          per_km_rate: data.per_km_rate || 0,
          average_rating: data.average_rating || 5.0,
          total_reviews: data.total_reviews || 0,
          completion_rate: data.completion_rate || 100,
          social_insta: data.social_insta || '',
          social_facebook: data.social_facebook || '',
          created_at: data.created_at || new Date().toISOString(),
          updated_at: data.updated_at || new Date().toISOString(),
        })
      }

      return drivers
    } catch (error) {
      console.error('Error fetching drivers from Firebase:', error)
      return []
    }
  },

  async getVerifiedDrivers(): Promise<Driver[]> {
    try {
      const driversRef = collection(db, DRIVERS_COLLECTION)
      const q = query(
        driversRef,
        where('current_status', '==', 'verified'),
        orderBy('average_rating', 'desc')
      )
      const querySnapshot = await getDocs(q)

      return querySnapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      } as Driver))
    } catch (error) {
      console.error('Error fetching verified drivers:', error)
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

      const data = driverSnap.data()
      return {
        id: driverId,
        ...data
      } as Driver
    } catch (error) {
      console.error('Error fetching driver by ID:', error)
      return null
    }
  },

  async createDriver(driverData: Omit<Driver, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, DRIVERS_COLLECTION), {
        ...driverData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        average_rating: driverData.average_rating || 5.0,
        total_reviews: driverData.total_reviews || 0,
        completion_rate: driverData.completion_rate || 100,
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
        updated_at: new Date().toISOString(),
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

  async verifyDriver(driverId: string, adminId: string): Promise<void> {
    try {
      const driverRef = doc(db, DRIVERS_COLLECTION, driverId)
      await updateDoc(driverRef, {
        current_status: 'verified',
        verified_by_admin_id: adminId,
        verification_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Error verifying driver:', error)
      throw error
    }
  },

  async suspendDriver(driverId: string, reason: string): Promise<void> {
    try {
      const driverRef = doc(db, DRIVERS_COLLECTION, driverId)
      await updateDoc(driverRef, {
        current_status: 'suspended',
        suspension_reason: reason,
        suspended_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Error suspending driver:', error)
      throw error
    }
  },

  async uploadDriverPhoto(file: File, driverId: string, type: 'profile' | 'cover' | 'vehicle' | 'sltda_license' | 'driver_license' | 'national_id'): Promise<string> {
    try {
      const extension = file.name.split('.').pop() || 'jpg';
      const storageRef = ref(storage, `drivers/${driverId}/${type}_${Date.now()}.${extension}`)
      await uploadBytes(storageRef, file)
      const url = await getDownloadURL(storageRef)
      return url
    } catch (error) {
      console.error('Error uploading photo:', error)
      throw error
    }
  },

  async getDriverStats(): Promise<{
    total: number;
    verified: number;
    pending: number;
    suspended: number;
  }> {
    try {
      const driversRef = collection(db, DRIVERS_COLLECTION)
      const snapshot = await getDocs(driversRef)

      let verified = 0, pending = 0, suspended = 0

      snapshot.docs.forEach(doc => {
        const status = doc.data().current_status
        if (status === 'verified') verified++
        else if (status === 'pending_verification' || status === 'incomplete') pending++
        else if (status === 'suspended') suspended++
      })

      return {
        total: snapshot.size,
        verified,
        pending,
        suspended
      }
    } catch (error) {
      console.error('Error getting driver stats:', error)
      return { total: 0, verified: 0, pending: 0, suspended: 0 }
    }
  }
}
