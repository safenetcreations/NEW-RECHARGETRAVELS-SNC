import { auth, db } from '@/lib/firebase';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  updateProfile,
  User,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
  limit
} from 'firebase/firestore';
import { firebaseWalletService } from './firebaseWalletService';

export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'user' | 'admin' | 'driver';
  phoneNumber?: string;
  address?: string;
  dateOfBirth?: string;
  nationality?: string;
  passportNumber?: string;
  preferences?: {
    language: string;
    currency: string;
    notifications: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  emailVerified: boolean;
}

class FirebaseAuthService {
  private googleProvider = new GoogleAuthProvider();

  // Sign up with email and password
  async signUp(email: string, password: string, displayName?: string): Promise<{ user: User | null; error: string | null }> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update display name if provided
      if (displayName) {
        await updateProfile(user, { displayName });
      }

      // Send email verification
      await sendEmailVerification(user);

      // Create user profile in Firestore
      await this.createUserProfile(user, { displayName });

      // Create user wallet
      await firebaseWalletService.createWallet(user.uid);

      return { user, error: null };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { user: null, error: this.getErrorMessage(error.code) };
    }
  }

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update last login
      await this.updateLastLogin(user.uid);

      return { user, error: null };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { user: null, error: this.getErrorMessage(error.code) };
    }
  }

  // Sign in with Google
  async signInWithGoogle(): Promise<{ user: User | null; error: string | null }> {
    try {
      const result = await signInWithPopup(auth, this.googleProvider);
      const user = result.user;

      // Check if user profile exists, if not create it
      const profile = await this.getUserProfile(user.uid);
      if (!profile) {
        await this.createUserProfile(user);
        await firebaseWalletService.createWallet(user.uid);
      } else {
        await this.updateLastLogin(user.uid);
      }

      return { user, error: null };
    } catch (error: any) {
      console.error('Google sign in error:', error);
      return { user: null, error: this.getErrorMessage(error.code) };
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }

  // Send password reset email
  async sendPasswordResetEmail(email: string): Promise<{ success: boolean; error: string | null }> {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true, error: null };
    } catch (error: any) {
      console.error('Password reset error:', error);
      return { success: false, error: this.getErrorMessage(error.code) };
    }
  }

  // Update password
  async updatePassword(newPassword: string): Promise<{ success: boolean; error: string | null }> {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'No authenticated user' };
      }

      await updatePassword(user, newPassword);
      return { success: true, error: null };
    } catch (error: any) {
      console.error('Update password error:', error);
      return { success: false, error: this.getErrorMessage(error.code) };
    }
  }

  // Update email
  async updateEmail(newEmail: string, currentPassword: string): Promise<{ success: boolean; error: string | null }> {
    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        return { success: false, error: 'No authenticated user' };
      }

      // Re-authenticate user before email update
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update email
      await updateEmail(user, newEmail);
      
      // Send verification to new email
      await sendEmailVerification(user);

      // Update profile in Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        email: newEmail,
        updatedAt: serverTimestamp()
      });

      return { success: true, error: null };
    } catch (error: any) {
      console.error('Update email error:', error);
      return { success: false, error: this.getErrorMessage(error.code) };
    }
  }

  // Create user profile in Firestore
  private async createUserProfile(user: User, additionalData?: any): Promise<void> {
    const userRef = doc(db, 'users', user.uid);
    
    const profile: any = {
      email: user.email,
      displayName: user.displayName || additionalData?.displayName || '',
      photoURL: user.photoURL || '',
      role: 'user',
      emailVerified: user.emailVerified,
      preferences: {
        language: 'en',
        currency: 'LKR',
        notifications: true
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp()
    };

    // Add any additional data
    if (additionalData) {
      Object.assign(profile, additionalData);
    }

    await setDoc(userRef, profile);
  }

  // Get user profile from Firestore
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (!userDoc.exists()) {
        return null;
      }

      const data = userDoc.data();
      return {
        id: userDoc.id,
        email: data.email,
        displayName: data.displayName,
        photoURL: data.photoURL,
        role: data.role,
        phoneNumber: data.phoneNumber,
        address: data.address,
        dateOfBirth: data.dateOfBirth,
        nationality: data.nationality,
        passportNumber: data.passportNumber,
        preferences: data.preferences,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        lastLoginAt: data.lastLoginAt?.toDate(),
        emailVerified: data.emailVerified || false
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<{ success: boolean; error: string | null }> {
    try {
      const userRef = doc(db, 'users', userId);
      
      // Remove fields that shouldn't be updated directly
      const { id, createdAt, ...updateData } = updates as any;
      
      await updateDoc(userRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });

      // Update Firebase Auth profile if displayName or photoURL changed
      const user = auth.currentUser;
      if (user && (updates.displayName || updates.photoURL)) {
        await updateProfile(user, {
          displayName: updates.displayName || user.displayName,
          photoURL: updates.photoURL || user.photoURL
        });
      }

      return { success: true, error: null };
    } catch (error: any) {
      console.error('Update profile error:', error);
      return { success: false, error: error.message };
    }
  }

  // Update last login time
  private async updateLastLogin(userId: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', userId), {
        lastLoginAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating last login:', error);
    }
  }

  // Check if user is admin
  async isAdmin(userId: string): Promise<boolean> {
    try {
      const profile = await this.getUserProfile(userId);
      return profile?.role === 'admin';
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }

  // Check if email exists
  async checkEmailExists(email: string): Promise<boolean> {
    try {
      const usersQuery = query(
        collection(db, 'users'),
        where('email', '==', email),
        limit(1)
      );
      
      const querySnapshot = await getDocs(usersQuery);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  }

  // Subscribe to auth state changes
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }

  // Get current user
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Get error message based on error code
  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'This email is already registered';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/operation-not-allowed':
        return 'Operation not allowed';
      case 'auth/weak-password':
        return 'Password is too weak';
      case 'auth/user-disabled':
        return 'This account has been disabled';
      case 'auth/user-not-found':
        return 'User not found';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/invalid-credential':
        return 'Invalid email or password';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection';
      case 'auth/popup-closed-by-user':
        return 'Sign in was cancelled';
      case 'auth/requires-recent-login':
        return 'Please sign in again to perform this action';
      default:
        return 'An error occurred. Please try again';
    }
  }
}

export const firebaseAuthService = new FirebaseAuthService();