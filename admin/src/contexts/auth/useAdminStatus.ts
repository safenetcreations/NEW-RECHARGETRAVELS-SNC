
import { useState } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/services/firebaseService';

export const useAdminStatus = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminStatus = async (userId: string) => {
    try {
      const profileDoc = await getDoc(doc(db, 'profiles', userId));
      
      if (profileDoc.exists() && profileDoc.data()?.is_admin) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  return { isAdmin, setIsAdmin, checkAdminStatus };
};
