import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

// ============ INTERFACES ============
export interface DriverRegistrationData {
  // Personal Info
  firstName: string;
  lastName: string;
  shortName: string;
  email: string;
  phone: string;
  whatsapp: string;
  dateOfBirth: string;
  address: string;

  // Professional Info
  licenseNumber: string;
  sltdaLicenseNumber?: string;
  tourGuideLicenseNumber?: string;
  yearsExperience: number;
  bio: string;
  tagline: string;
  languages: string[];
  specialties: string[];

  // Vehicle Info
  vehiclePreference: 'own_vehicle' | 'company_vehicle' | 'any_vehicle';
  ownVehicle?: {
    type: string;
    make: string;
    model: string;
    year: number;
    seats: number;
    features: string[];
    registrationNumber: string;
  };

  // Coverage
  coverageAreas: string[];

  // Documents (URLs after upload)
  documents: {
    cv?: string;
    drivingLicense?: string;
    sltdaLicense?: string;
    tourGuideLicense?: string;
    policeReport?: string;
    characterCertificate?: string;
    vehicleRegistration?: string;
    vehicleInsurance?: string;
  };

  // Photos
  profilePhoto?: string;
  heroImages: string[];
  vehicleImages: string[];
}

export interface DriverProfile extends DriverRegistrationData {
  id: string;
  userId: string;

  // Status
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'suspended';
  verificationNotes?: string;
  verifiedBy?: string;
  verifiedAt?: any;

  // Badges (assigned by admin)
  badges: string[];
  isVerified: boolean;
  isSLTDAApproved: boolean;
  isTourGuide: boolean;

  // Stats
  rating: number;
  totalReviews: number;
  totalTrips: number;
  responseTime: string;
  acceptanceRate: number;
  completionRate: number;

  // Timestamps
  createdAt?: any;
  updatedAt?: any;
}

// ============ COLLECTION NAME ============
const DRIVERS_COLLECTION = 'driverProfiles';
const DRIVER_DOCUMENTS_COLLECTION = 'driverDocuments';

// ============ HELPER FUNCTIONS ============

// Upload file to Firebase Storage
export async function uploadDriverFile(
  driverId: string,
  file: File,
  type: 'document' | 'photo' | 'vehicle'
): Promise<string> {
  const timestamp = Date.now();
  const extension = file.name.split('.').pop();
  const path = `drivers/${driverId}/${type}s/${timestamp}.${extension}`;

  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(storageRef);

  return downloadUrl;
}

// ============ DRIVER REGISTRATION ============

export async function registerDriver(
  userId: string,
  data: Partial<DriverRegistrationData>
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const driverData: Partial<DriverProfile> = {
      ...data,
      userId,
      status: 'pending',
      badges: [],
      isVerified: false,
      isSLTDAApproved: false,
      isTourGuide: false,
      rating: 0,
      totalReviews: 0,
      totalTrips: 0,
      responseTime: 'N/A',
      acceptanceRate: 0,
      completionRate: 0,
      heroImages: data.heroImages || [],
      vehicleImages: data.vehicleImages || [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, DRIVERS_COLLECTION), driverData);

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error registering driver:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// ============ GET DRIVER ============

export async function getDriverById(driverId: string): Promise<DriverProfile | null> {
  try {
    const docRef = doc(db, DRIVERS_COLLECTION, driverId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as DriverProfile;
    }
    return null;
  } catch (error) {
    console.error('Error fetching driver:', error);
    return null;
  }
}

export async function getDriverByUserId(userId: string): Promise<DriverProfile | null> {
  try {
    const q = query(
      collection(db, DRIVERS_COLLECTION),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as DriverProfile;
    }
    return null;
  } catch (error) {
    console.error('Error fetching driver by userId:', error);
    return null;
  }
}

// ============ GET ALL DRIVERS ============

export async function getAllDrivers(
  status?: 'pending' | 'under_review' | 'approved' | 'rejected' | 'suspended'
): Promise<DriverProfile[]> {
  try {
    let q;
    if (status) {
      q = query(
        collection(db, DRIVERS_COLLECTION),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
    } else {
      q = query(
        collection(db, DRIVERS_COLLECTION),
        orderBy('createdAt', 'desc')
      );
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as DriverProfile));
  } catch (error) {
    console.error('Error fetching drivers:', error);
    return [];
  }
}

export async function getApprovedDrivers(): Promise<DriverProfile[]> {
  return getAllDrivers('approved');
}

// ============ UPDATE DRIVER ============

export async function updateDriver(
  driverId: string,
  data: Partial<DriverProfile>
): Promise<{ success: boolean; error?: string }> {
  try {
    const docRef = doc(db, DRIVERS_COLLECTION, driverId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating driver:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// ============ ADMIN FUNCTIONS ============

export async function approveDriver(
  driverId: string,
  adminId: string,
  badges: string[] = []
): Promise<{ success: boolean; error?: string }> {
  try {
    const docRef = doc(db, DRIVERS_COLLECTION, driverId);
    await updateDoc(docRef, {
      status: 'approved',
      isVerified: true,
      badges: badges.length > 0 ? badges : ['recharge_verified'],
      verifiedBy: adminId,
      verifiedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error approving driver:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function rejectDriver(
  driverId: string,
  adminId: string,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const docRef = doc(db, DRIVERS_COLLECTION, driverId);
    await updateDoc(docRef, {
      status: 'rejected',
      verificationNotes: reason,
      verifiedBy: adminId,
      verifiedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error rejecting driver:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function suspendDriver(
  driverId: string,
  adminId: string,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const docRef = doc(db, DRIVERS_COLLECTION, driverId);
    await updateDoc(docRef, {
      status: 'suspended',
      verificationNotes: reason,
      verifiedBy: adminId,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error suspending driver:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function updateDriverBadges(
  driverId: string,
  badges: string[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const docRef = doc(db, DRIVERS_COLLECTION, driverId);
    await updateDoc(docRef, {
      badges,
      isSLTDAApproved: badges.includes('sltda_verified'),
      isTourGuide: badges.includes('tour_guide_license'),
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating badges:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// ============ DRIVER STATS ============

export async function updateDriverStats(
  driverId: string,
  stats: {
    rating?: number;
    totalReviews?: number;
    totalTrips?: number;
    responseTime?: string;
    acceptanceRate?: number;
    completionRate?: number;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const docRef = doc(db, DRIVERS_COLLECTION, driverId);
    await updateDoc(docRef, {
      ...stats,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating driver stats:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// ============ DELETE DRIVER ============

export async function deleteDriver(
  driverId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const docRef = doc(db, DRIVERS_COLLECTION, driverId);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting driver:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
