
import { getDocs, getDoc, collection, query, where, orderBy, addDoc, updateDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '@/lib/firebase';
import type { SafariPackage } from './types';

export async function createSafariPackage(packageData: {
  name?: string;
  start_date: string;
  end_date: string;
  total_participants: number;
  package_data: any;
  subtotal: number;
  taxes?: number;
  total_amount: number;
}) {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      return { data: null, error: new Error('User must be logged in') };
    }

    const docRef = await addDoc(collection(db, 'safari_packages'), {
      user_id: user.uid,
      ...packageData,
      taxes: packageData.taxes || 0,
      status: 'draft',
      created_at: new Date().toISOString()
    });
    
    const docSnap = await getDoc(docRef);
    const data = { id: docSnap.id, ...docSnap.data() };
    
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function getUserSafariPackages() {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      return { data: null, error: new Error('User must be logged in') };
    }

    const q = query(
      collection(db, 'safari_packages'),
      where('user_id', '==', user.uid),
      orderBy('created_at', 'desc')
    );
    const snapshot = await getDocs(q);
    const packages = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })) as any[];
    
    return { data: packages, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function updateSafariPackage(packageId: string, updates: Partial<SafariPackage>) {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      return { data: null, error: new Error('User must be logged in') };
    }

    const packageRef = doc(db, 'safari_packages', packageId);
    const packageDoc = await getDoc(packageRef);
    
    if (!packageDoc.exists()) {
      return { data: null, error: new Error('Package not found') };
    }
    
    if (packageDoc.data().user_id !== user.uid) {
      return { data: null, error: new Error('Unauthorized') };
    }
    
    await updateDoc(packageRef, { 
      ...updates,
      updated_at: new Date().toISOString()
    });
    
    const updatedDoc = await getDoc(packageRef);
    const data = { id: updatedDoc.id, ...updatedDoc.data() };
    
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
