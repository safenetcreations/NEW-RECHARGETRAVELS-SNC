
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { User } from './types';

export const useAuthMethods = () => {
  const auth = getAuth();

  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { data: { user: { ...result.user, id: result.user.uid } }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return { data: { user: { ...result.user, id: result.user.uid } }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: updates.displayName || auth.currentUser.displayName,
          photoURL: updates.photoURL || auth.currentUser.photoURL
        });
        return { data: { user: { ...auth.currentUser, id: auth.currentUser.uid } }, error: null };
      }
      return { data: null, error: new Error('No user logged in') };
    } catch (error) {
      return { data: null, error };
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateUser
  };
};
