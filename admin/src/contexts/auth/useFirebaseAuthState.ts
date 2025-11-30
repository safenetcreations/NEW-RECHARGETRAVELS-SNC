import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { firebaseAuthService } from '@/services/firebaseAuthService';

export const useFirebaseAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = firebaseAuthService.onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // Check admin status
        const profile = await firebaseAuthService.getUserProfile(firebaseUser.uid);
        setIsAdmin(profile?.role === 'admin' || profile?.role === 'super_admin');
      } else {
        setIsAdmin(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading, isAdmin };
};