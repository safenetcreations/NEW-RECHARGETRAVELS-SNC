
import { useState } from 'react';
import { dbService, authService, storageService } from '@/lib/firebase-services';

export const useAdminStatus = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .single();
      
      if (!error && data?.is_admin) {
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
