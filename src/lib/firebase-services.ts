// Comprehensive Firebase Services to replace Supabase functionality
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  onSnapshot,
  addDoc,
  serverTimestamp,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  listAll
} from 'firebase/storage';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  onAuthStateChanged
} from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { db, auth, storage } from './firebase';

// Initialize Firebase Functions
const functions = getFunctions();

// Auth Services
export const authService = {
  async signUp(email: string, password: string, displayName?: string) {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(user, { displayName });
    }
    // Create user profile in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email,
      displayName,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return user;
  },

  async signIn(email: string, password: string) {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return user;
  },

  async signOut() {
    await signOut(auth);
  },

  async resetPassword(email: string) {
    await sendPasswordResetEmail(auth, email);
  },

  onAuthStateChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  },

  getCurrentUser() {
    return auth.currentUser;
  },

  async signInWithOAuth(options: { provider: string, options?: any }) {
    // Firebase doesn't support OAuth the same way as Supabase
    // You'll need to implement provider-specific login
    // For now, returning a placeholder
    return { error: new Error('OAuth login not yet implemented. Please use email/password login.') };
  }
};

// Database Services
export const dbService = {
  // Generic CRUD operations
  async create(collectionName: string, data: any) {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...data };
  },

  async get(collectionName: string, id: string) {
    const docSnap = await getDoc(doc(db, collectionName, id));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  },

  async update(collectionName: string, id: string, data: any) {
    await updateDoc(doc(db, collectionName, id), {
      ...data,
      updatedAt: serverTimestamp()
    });
    return { id, ...data };
  },

  async delete(collectionName: string, id: string) {
    await deleteDoc(doc(db, collectionName, id));
  },

  async list(collectionName: string, filters?: any[], orderByField?: string, limitCount?: number) {
    let q = collection(db, collectionName);
    
    if (filters) {
      filters.forEach(filter => {
        q = query(q, where(filter.field, filter.operator, filter.value));
      });
    }
    
    if (orderByField) {
      q = query(q, orderBy(orderByField));
    }
    
    if (limitCount) {
      q = query(q, limit(limitCount));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Real-time subscriptions
  subscribe(collectionName: string, callback: (data: any[]) => void, filters?: any[]) {
    let q = collection(db, collectionName);
    
    if (filters) {
      filters.forEach(filter => {
        q = query(q, where(filter.field, filter.operator, filter.value));
      });
    }
    
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(data);
    });
  },

  // Batch operations
  async batchWrite(operations: Array<{ type: 'create' | 'update' | 'delete', collection: string, id?: string, data?: any }>) {
    const batch = writeBatch(db);
    
    operations.forEach(op => {
      if (op.type === 'create') {
        const docRef = doc(collection(db, op.collection));
        batch.set(docRef, {
          ...op.data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      } else if (op.type === 'update' && op.id) {
        const docRef = doc(db, op.collection, op.id);
        batch.update(docRef, {
          ...op.data,
          updatedAt: serverTimestamp()
        });
      } else if (op.type === 'delete' && op.id) {
        const docRef = doc(db, op.collection, op.id);
        batch.delete(docRef);
      }
    });
    
    await batch.commit();
  }
};

// Storage Services
export const storageService = {
  async upload(path: string, file: File) {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return { path, url };
  },

  async delete(path: string) {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  },

  async getUrl(path: string) {
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  },

  async list(path: string) {
    const storageRef = ref(storage, path);
    const result = await listAll(storageRef);
    const urls = await Promise.all(
      result.items.map(async (item) => ({
        name: item.name,
        path: item.fullPath,
        url: await getDownloadURL(item)
      }))
    );
    return urls;
  }
};

// Cloud Functions Services
export const functionsService = {
  // Content Generation
  async generateBlogContent(data: any) {
    const generateContent = httpsCallable(functions, 'generateBlogContent');
    const result = await generateContent(data);
    return result.data;
  },

  async generateSEOContent(data: any) {
    const generateSEO = httpsCallable(functions, 'generateSEOContent');
    const result = await generateSEO(data);
    return result.data;
  },

  // Email & Notifications
  async sendEmail(data: any) {
    const sendEmail = httpsCallable(functions, 'sendEmail');
    const result = await sendEmail(data);
    return result.data;
  },

  async sendWhatsAppMessage(data: any) {
    const sendWhatsApp = httpsCallable(functions, 'sendWhatsAppMessage');
    const result = await sendWhatsApp(data);
    return result.data;
  },

  // Booking Services
  async calculatePrice(data: any) {
    const calculatePrice = httpsCallable(functions, 'calculatePrice');
    const result = await calculatePrice(data);
    return result.data;
  },

  async processBooking(data: any) {
    const processBooking = httpsCallable(functions, 'processBooking');
    const result = await processBooking(data);
    return result.data;
  },

  // Social Media
  async scheduleSocialPost(data: any) {
    const schedulePost = httpsCallable(functions, 'scheduleSocialPost');
    const result = await schedulePost(data);
    return result.data;
  },

  // Analytics
  async getAnalyticsReport(data: any) {
    const getReport = httpsCallable(functions, 'getAnalyticsReport');
    const result = await getReport(data);
    return result.data;
  }
};

// CMS Services (replacing Supabase CMS functionality)
export const cmsService = {
  // Articles
  async getArticles(categoryId?: string, limit?: number) {
    const filters = categoryId ? [{ field: 'categoryId', operator: '==', value: categoryId }] : undefined;
    return await dbService.list('articles', filters, 'publishedAt', limit);
  },

  async createArticle(data: any) {
    return await dbService.create('articles', {
      ...data,
      publishedAt: serverTimestamp(),
      status: 'published'
    });
  },

  async updateArticle(id: string, data: any) {
    return await dbService.update('articles', id, data);
  },

  // Hotels
  async getHotels(filters?: any) {
    const queryFilters = [];
    if (filters?.category) {
      queryFilters.push({ field: 'category', operator: '==', value: filters.category });
    }
    if (filters?.city) {
      queryFilters.push({ field: 'city', operator: '==', value: filters.city });
    }
    return await dbService.list('hotels', queryFilters, 'rating', filters?.limit);
  },

  // Tours
  async getTours(categoryId?: string) {
    const filters = categoryId ? [{ field: 'categoryId', operator: '==', value: categoryId }] : undefined;
    return await dbService.list('tours', filters, 'popularity');
  },

  // Activities
  async getActivities(location?: string) {
    const filters = location ? [{ field: 'location', operator: '==', value: location }] : undefined;
    return await dbService.list('activities', filters, 'rating');
  },

  // Destinations
  async getDestinations() {
    return await dbService.list('destinations', undefined, 'name');
  },

  // Content Calendar
  async getContentCalendar(date?: string) {
    const filters = date ? [{ field: 'targetDate', operator: '==', value: date }] : undefined;
    return await dbService.list('contentCalendar', filters, 'targetDate');
  },

  async scheduleContent(data: any) {
    return await dbService.create('contentCalendar', data);
  }
};

// Helper function to migrate from Supabase response format
export function formatResponse(data: any, error?: any) {
  if (error) {
    return { data: null, error };
  }
  return { data, error: null };
}

// Export all services
export default {
  auth: authService,
  db: dbService,
  storage: storageService,
  functions: functionsService,
  cms: cmsService
};
