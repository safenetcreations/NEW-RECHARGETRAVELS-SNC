
import { getDocs, getDoc, collection, query, where, orderBy, addDoc, updateDoc, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { db } from '@/services/firebaseService';

export interface AdminStats {
  totalLodges: number;
  activeLodges: number;
  totalActivities: number;
  activeActivities: number;
  totalBookings: number;
  monthlyRevenue: number;
  totalRevenue: number;
  newBookingsToday: number;
}

export interface Lodge {
  id: string;
  name: string;
  description: string;
  location: string;
  price_per_night: number;
  amenities: any;
  images: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  slug: string;
  capacity?: number;
  features?: string[];
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  location: any;
  difficulty: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Helper function to generate slug from name
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

// Admin Dashboard Stats
export async function getAdminDashboardStats(): Promise<{ data: AdminStats | null; error: any }> {
  try {
    // Get lodges stats
    const lodgesQuery = query(collection(db, 'lodges'));
    const lodgesSnapshot = await getDocs(lodgesQuery);
    const lodges = lodgesSnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })) as any[];

    // Get activities stats  
    const activitiesQuery = query(collection(db, 'activities'));
    const activitiesSnapshot = await getDocs(activitiesQuery);
    const activities = activitiesSnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })) as any[];

    // Get bookings stats
    const bookingsQuery = query(collection(db, 'bookings'));
    const bookingsSnapshot = await getDocs(bookingsQuery);
    const bookings = bookingsSnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })) as any[];

    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const stats: AdminStats = {
      totalLodges: lodges?.length || 0,
      activeLodges: lodges?.filter(l => l.is_active).length || 0,
      totalActivities: activities?.length || 0,
      activeActivities: activities?.filter(a => a.is_active).length || 0,
      totalBookings: bookings?.length || 0,
      monthlyRevenue: bookings?.filter(b => 
        new Date(b.created_at) >= thisMonth
      ).reduce((sum, b) => sum + (b.total_price || 0), 0) || 0,
      totalRevenue: bookings?.reduce((sum, b) => sum + (b.total_price || 0), 0) || 0,
      newBookingsToday: bookings?.filter(b => 
        new Date(b.created_at) >= today
      ).length || 0
    };

    return { data: stats, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

// Lodge CRUD Operations
export async function createLodge(lodge: Omit<Lodge, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const lodgeData = {
      ...lodge,
      slug: lodge.slug || generateSlug(lodge.name),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, 'lodges'), lodgeData);
    const docSnap = await getDoc(docRef);
    const data = { id: docSnap.id, ...docSnap.data() };

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function updateLodge(id: string, updates: Partial<Lodge>) {
  try {
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    // If name is being updated, also update slug
    if (updates.name && !updates.slug) {
      updateData.slug = generateSlug(updates.name);
    }

    await updateDoc(doc(db, 'lodges', id), updateData);
    
    // Get updated document
    const docSnap = await getDoc(doc(db, 'lodges', id));
    const data = { id: docSnap.id, ...docSnap.data() };

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function deleteLodge(id: string) {
  try {
    await deleteDoc(doc(db, 'lodges', id));
    return { error: null };
  } catch (error) {
    return { error };
  }
}

// Activity CRUD Operations
export async function createActivity(activity: Omit<Activity, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const docRef = await addDoc(collection(db, 'activities'), {
      ...activity,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    
    const docSnap = await getDoc(docRef);
    const data = { id: docSnap.id, ...docSnap.data() };

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function updateActivity(id: string, updates: Partial<Activity>) {
  try {
    await updateDoc(doc(db, 'activities', id), {
      ...updates,
      updated_at: new Date().toISOString()
    });
    
    // Get updated document
    const docSnap = await getDoc(doc(db, 'activities', id));
    const data = { id: docSnap.id, ...docSnap.data() };

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function deleteActivity(id: string) {
  try {
    await deleteDoc(doc(db, 'activities', id));
    return { error: null };
  } catch (error) {
    return { error };
  }
}

// Booking Management
export async function getAllBookings() {
  try {
    const q = query(collection(db, 'bookings'), orderBy('created_at', 'desc'));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function updateBookingStatus(bookingId: string, status: string, notes?: string) {
  try {
    await updateDoc(doc(db, 'bookings', bookingId), {
      status,
      updated_at: new Date().toISOString()
    });
    
    // Get updated document
    const docSnap = await getDoc(doc(db, 'bookings', bookingId));
    const data = { id: docSnap.id, ...docSnap.data() };

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

// Bulk Operations
export async function bulkUpdateLodgeStatus(lodgeIds: string[], isActive: boolean) {
  try {
    const batch = writeBatch(db);
    
    lodgeIds.forEach(id => {
      const docRef = doc(db, 'lodges', id);
      batch.update(docRef, { 
        is_active: isActive,
        updated_at: new Date().toISOString()
      });
    });
    
    await batch.commit();
    return { data: null, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function bulkUpdateActivityStatus(activityIds: string[], isActive: boolean) {
  try {
    const batch = writeBatch(db);
    
    activityIds.forEach(id => {
      const docRef = doc(db, 'activities', id);
      batch.update(docRef, { 
        is_active: isActive,
        updated_at: new Date().toISOString()
      });
    });
    
    await batch.commit();
    return { data: null, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
