import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { dbService, authService, storageService } from '@/lib/firebase-services';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔐 useAuth: Starting authentication check...');
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔐 useAuth: Session data:', session);
      setUser(session?.user ?? null);
      if (session?.user) {
        console.log('🔐 useAuth: User found, checking admin status for:', session.user.id);
        checkAdminStatus(session.user.id);
      } else {
        console.log('🔐 useAuth: No user session found');
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 useAuth: Auth state changed:', event, session);
        setUser(session?.user ?? null);
        if (session?.user) {
          checkAdminStatus(session.user.id);
        } else {
          setIsAdmin(false);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (userId: string) => {
    console.log('🔐 useAuth: Checking admin status for user:', userId);
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .single();
      
      console.log('🔐 useAuth: Profile data:', profile);
      const adminStatus = profile?.is_admin || false;
      console.log('🔐 useAuth: Admin status:', adminStatus);
      setIsAdmin(adminStatus);
    } catch (error) {
      console.error('🔐 useAuth: Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  console.log('🔐 useAuth: Current state - user:', user, 'isAdmin:', isAdmin, 'loading:', loading);

  return {
    user,
    isAdmin,
    loading,
  };
};