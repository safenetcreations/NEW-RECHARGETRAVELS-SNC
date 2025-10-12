
import { getDocs, getDoc, collection, query, where, orderBy, limit, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { WildlifeActivity } from './types';

export async function getWildlifeActivities() {
  try {
    const q = query(
      collection(db, 'wildlife_activities'),
      where('is_active', '==', true),
      orderBy('is_featured', 'desc')
    );
    const snapshot = await getDocs(q);
    const activities = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })) as any[];
    
    // Fetch activity types for each activity
    const activitiesWithTypes = await Promise.all(
      activities.map(async (activity) => {
        if (activity.type_id) {
          const typeDoc = await getDoc(doc(db, 'activity_types', activity.type_id));
          if (typeDoc.exists()) {
            activity.activity_types = { id: typeDoc.id, ...typeDoc.data() };
          }
        }
        return activity;
      })
    );
    
    return { data: activitiesWithTypes, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function getWildlifeActivityById(activityId: string) {
  try {
    const activityDoc = await getDoc(doc(db, 'wildlife_activities', activityId));
    
    if (!activityDoc.exists()) {
      return { data: null, error: new Error('Activity not found') };
    }
    
    const activity = { id: activityDoc.id, ...activityDoc.data() } as any;
    
    // Fetch activity type if exists
    if (activity.type_id) {
      const typeDoc = await getDoc(doc(db, 'activity_types', activity.type_id));
      if (typeDoc.exists()) {
        activity.activity_types = { id: typeDoc.id, ...typeDoc.data() };
      }
    }
    
    return { data: activity, error: null };
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
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    const activities = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })) as any[];
    
    // Fetch activity types for each activity
    const activitiesWithTypes = await Promise.all(
      activities.map(async (activity) => {
        if (activity.type_id) {
          const typeDoc = await getDoc(doc(db, 'activity_types', activity.type_id));
          if (typeDoc.exists()) {
            activity.activity_types = { id: typeDoc.id, ...typeDoc.data() };
          }
        }
        return activity;
      })
    );
    
    return { data: activitiesWithTypes, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
