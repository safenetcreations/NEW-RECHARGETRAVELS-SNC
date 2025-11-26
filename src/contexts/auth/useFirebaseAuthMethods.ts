import { User } from 'firebase/auth';
import { firebaseAuthService, UserProfile } from '@/services/firebaseAuthService';

export const useFirebaseAuthMethods = (user: User | null) => {
  const signUp = async (email: string, password: string, displayName?: string) => {
    const result = await firebaseAuthService.signUp(email, password, displayName);
    return { error: result.error };
  };

  const signIn = async (email: string, password: string) => {
    const result = await firebaseAuthService.signIn(email, password);
    return { error: result.error };
  };

  const signInWithGoogle = async () => {
    const result = await firebaseAuthService.signInWithGoogle();
    return { error: result.error };
  };

  const signOut = async () => {
    await firebaseAuthService.signOut();
  };

  const resetPassword = async (email: string) => {
    const result = await firebaseAuthService.sendPasswordResetEmail(email);
    return { error: result.error };
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: 'No user logged in' };
    
    const result = await firebaseAuthService.updateUserProfile(user.uid, updates);
    return { error: result.error };
  };

  const updatePassword = async (newPassword: string) => {
    const result = await firebaseAuthService.updatePassword(newPassword);
    return { error: result.error };
  };

  const updateEmail = async (newEmail: string, currentPassword: string) => {
    const result = await firebaseAuthService.updateEmail(newEmail, currentPassword);
    return { error: result.error };
  };

  return {
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateProfile,
    updatePassword,
    updateEmail
  };
};