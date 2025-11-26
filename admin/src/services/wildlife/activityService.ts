
import { getDocs, collection, query, where, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import { db } from '@/services/firebaseService';
import type { WildlifeActivity } from './types';

export async function getWildlifeActivities() {
  try {
    const q = query(
      collection(db, 'wildlife_activities'),
      where('is_active', '==', true),
      orderBy('is_featured', 'desc')
    );
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function getWildlifeActivityById(activityId: string) {
  try {
    const docRef = doc(db, 'wildlife_activities', activityId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists() && docSnap.data().is_active) {
      const data = { id: docSnap.id, ...docSnap.data() };
      return { data, error: null };
    } else {
      return { data: null, error: 'Activity not found or inactive' };
    }
  } catch (error) {
    return { data: null, error };
  }
}

export async function getFeaturedWildlifeActivities(limitCount: number = 6) {
  try {
    const q = query(
      collection(db, 'wildlife_activities'),
      where('is_active', '==', true),
      where('is_featured', '==', true),
      orderBy('is_featured', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
