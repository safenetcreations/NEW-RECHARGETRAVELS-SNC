// Import Firebase instances from the centralized firebase.ts
import { auth, db, storage } from '@/lib/firebase';

// Import only the functions we need, not the initialization
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  QueryConstraint,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';

// Re-export db and storage for backward compatibility
export { db, storage };

// Extended User type to include id
export interface User extends FirebaseUser {
  id: string;
}

// Auth Service
export const authService = {
  signIn: async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { data: { user: { ...result.user, id: result.user.uid } }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  signUp: async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return { data: { user: { ...result.user, id: result.user.uid } }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  signOut: async () => {
    try {
      await signOut(auth);
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  onAuthStateChange: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        callback({ ...user, id: user.uid });
      } else {
        callback(null);
      }
    });
  },

  getUser: async () => {
    const user = auth.currentUser;
    return { data: { user: user ? { ...user, id: user.uid } : null }, error: null };
  },

  getSession: async () => {
    const user = auth.currentUser;
    return { data: { session: { user: user ? { ...user, id: user.uid } : null } }, error: null };
  },

  updateUser: async (updates: any) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');
      
      await updateProfile(user, updates);
      return { data: { user: { ...user, id: user.uid } }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  resetPassword: async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { error: null };
    } catch (error) {
      return { error };
    }
  }
};

// Database Service (simplified, no mock data)
export const dbService = {
  // You can add firestore methods here if you want a service layer
};

// Storage Service
export const storageService = {
  from: (bucket: string) => ({
    upload: async (path: string, file: File) => {
      const storageRef = ref(storage, `${bucket}/${path}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      return { data: { path: url }, error: null };
    },
    getPublicUrl: async (path: string) => {
      const storageRef = ref(storage, path);
      const url = await getDownloadURL(storageRef);
      return { data: { publicUrl: url } };
    }
  })
};

// Functions Service (assuming you might use cloud functions)
export const functionsService = {
  invoke: async (functionName: string, params?: any) => {
    // This would require setting up firebase functions
    return { data: { success: true }, error: null };
  }
};


