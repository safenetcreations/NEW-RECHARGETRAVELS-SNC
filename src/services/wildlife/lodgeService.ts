
import { getDocs, getDoc, collection, query, where, orderBy, limit, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Lodge } from './types';

export async function getLodges() {
  try {
    const q = query(
      collection(db, 'lodges'),
      where('is_active', '==', true),
      orderBy('is_featured', 'desc')
    );
    const snapshot = await getDocs(q);
    const lodges = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })) as any[];
    
    // Fetch lodge categories for each lodge
    const lodgesWithCategories = await Promise.all(
      lodges.map(async (lodge) => {
        if (lodge.category_id) {
          const categoryDoc = await getDoc(doc(db, 'lodge_categories', lodge.category_id));
          if (categoryDoc.exists()) {
            lodge.lodge_categories = { id: categoryDoc.id, ...categoryDoc.data() };
          }
        }
        return lodge;
      })
    );
    
    return { data: lodgesWithCategories, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function getLodgeById(lodgeId: string) {
  try {
    const lodgeDoc = await getDoc(doc(db, 'lodges', lodgeId));
    
    if (!lodgeDoc.exists()) {
      return { data: null, error: new Error('Lodge not found') };
    }
    
    const lodge = { id: lodgeDoc.id, ...lodgeDoc.data() } as any;
    
    // Fetch lodge category if exists
    if (lodge.category_id) {
      const categoryDoc = await getDoc(doc(db, 'lodge_categories', lodge.category_id));
      if (categoryDoc.exists()) {
        lodge.lodge_categories = { id: categoryDoc.id, ...categoryDoc.data() };
      }
    }
    
    return { data: lodge, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function getFeaturedLodges(limitCount: number = 6) {
  try {
    const q = query(
      collection(db, 'lodges'),
      where('is_active', '==', true),
      where('is_featured', '==', true),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    const lodges = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })) as any[];
    
    // Fetch lodge categories for each lodge
    const lodgesWithCategories = await Promise.all(
      lodges.map(async (lodge) => {
        if (lodge.category_id) {
          const categoryDoc = await getDoc(doc(db, 'lodge_categories', lodge.category_id));
          if (categoryDoc.exists()) {
            lodge.lodge_categories = { id: categoryDoc.id, ...categoryDoc.data() };
          }
        }
        return lodge;
      })
    );
    
    return { data: lodgesWithCategories, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
