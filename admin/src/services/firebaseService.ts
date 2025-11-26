// Import Firebase instances from the centralized firebase.ts
import app, { auth, db, storage } from '@/lib/firebase';

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

// Re-export for backward compatibility
export { app, db, storage, auth };

// Extended User type to include id
export interface User extends FirebaseUser {
  id: string;
}

// Mock data for development
const mockData: Record<string, any[]> = {
  activities: [
    { id: '1', name: 'Wildlife Safari', created_at: new Date().toISOString() },
    { id: '2', name: 'Cultural Tour', created_at: new Date().toISOString() }
  ],
  drivers: [
    { id: '1', name: 'John Doe', created_at: new Date().toISOString() },
    { id: '2', name: 'Jane Smith', created_at: new Date().toISOString() }
  ],
  tour_packages: [
    { id: '1', name: 'Classic Tour', created_at: new Date().toISOString() },
    { id: '2', name: 'Luxury Tour', created_at: new Date().toISOString() }
  ],
  hotels: [
    { id: '1', name: 'Grand Hotel', country: 'Sri Lanka' },
    { id: '2', name: 'Beach Resort', country: 'Sri Lanka' }
  ],
  hotel_images: [
    { id: '1', hotel_id: '1', sort_order: 1 },
    { id: '2', hotel_id: '1', sort_order: 2 }
  ],
  destination: [
    { dest_id: '1', name: 'Colombo', published: true },
    { dest_id: '2', name: 'Kandy', published: true }
  ],
  article: [
    { article_id: '1', title: 'Travel Guide', published: true },
    { article_id: '2', title: 'Culture Guide', published: true }
  ],
  wildlife_activities: [
    { id: '1', name: 'Elephant Safari', is_active: true, is_featured: true },
    { id: '2', name: 'Bird Watching', is_active: true, is_featured: false }
  ],
  lodges: [
    { id: '1', name: 'Wildlife Lodge', is_active: true, is_featured: true },
    { id: '2', name: 'Eco Lodge', is_active: true, is_featured: false }
  ],
  bookings: [
    { id: '1', total_price: 1000, created_at: new Date().toISOString() },
    { id: '2', total_price: 1500, created_at: new Date().toISOString() }
  ],
  wildlife_bookings: [
    { id: '1', user_id: 'user1', created_at: new Date().toISOString() },
    { id: '2', user_id: 'user1', created_at: new Date().toISOString() }
  ],
  safari_packages: [
    { id: '1', user_id: 'user1', created_at: new Date().toISOString() },
    { id: '2', user_id: 'user1', created_at: new Date().toISOString() }
  ],
  newsletter_subscribers: [
    { id: '1', is_active: true, subscribed_at: new Date().toISOString() },
    { id: '2', is_active: true, subscribed_at: new Date().toISOString() }
  ],
  reviews: [
    { id: '1', item_id: 'hotel1', created_at: new Date().toISOString() },
    { id: '2', item_id: 'hotel1', created_at: new Date().toISOString() }
  ]
};

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

// Create a comprehensive mock query builder
const createQueryBuilder = (collectionName: string) => {
  const data = mockData[collectionName] || [];
  
  return {
    select: (columns?: string) => ({
      eq: (field: string, value: any) => ({
        eq: (field2: string, value2: any) => ({
          order: (orderField: string, options?: any) => ({
            single: async () => {
              const filtered = data.filter((item: any) => 
                item[field] === value && item[field2] === value2
              );
              const sorted = filtered.sort((a: any, b: any) => {
                if (options?.ascending) {
                  return a[orderField] > b[orderField] ? 1 : -1;
                }
                return a[orderField] < b[orderField] ? 1 : -1;
              });
              return { data: sorted[0] || null, error: null };
            },
            then: async (callback: any) => {
              const filtered = data.filter((item: any) => 
                item[field] === value && item[field2] === value2
              );
              const sorted = filtered.sort((a: any, b: any) => {
                if (options?.ascending) {
                  return a[orderField] > b[orderField] ? 1 : -1;
                }
                return a[orderField] < b[orderField] ? 1 : -1;
              });
              return callback({ data: sorted, error: null });
            }
          }),
          single: async () => {
            const filtered = data.filter((item: any) => 
              item[field] === value && item[field2] === value2
            );
            return { data: filtered[0] || null, error: null };
          },
          then: async (callback: any) => {
            const filtered = data.filter((item: any) => 
              item[field] === value && item[field2] === value2
            );
            return callback({ data: filtered, error: null });
          }
        }),
        order: (orderField: string, options?: any) => ({
          single: async () => {
            const filtered = data.filter((item: any) => item[field] === value);
            const sorted = filtered.sort((a: any, b: any) => {
              if (options?.ascending) {
                return a[orderField] > b[orderField] ? 1 : -1;
              }
              return a[orderField] < b[orderField] ? 1 : -1;
            });
            return { data: sorted[0] || null, error: null };
          },
          then: async (callback: any) => {
            const filtered = data.filter((item: any) => item[field] === value);
            const sorted = filtered.sort((a: any, b: any) => {
              if (options?.ascending) {
                return a[orderField] > b[orderField] ? 1 : -1;
              }
              return a[orderField] < b[orderField] ? 1 : -1;
            });
            return callback({ data: sorted, error: null });
          }
        }),
        single: async () => {
          const filtered = data.filter((item: any) => item[field] === value);
          return { data: filtered[0] || null, error: null };
        },
        then: async (callback: any) => {
          const filtered = data.filter((item: any) => item[field] === value);
          return callback({ data: filtered, error: null });
        }
      }),
      order: (orderField: string, options?: any) => ({
        single: async () => {
          const sorted = data.sort((a: any, b: any) => {
            if (options?.ascending) {
              return a[orderField] > b[orderField] ? 1 : -1;
            }
            return a[orderField] < b[orderField] ? 1 : -1;
          });
          return { data: sorted[0] || null, error: null };
        },
        then: async (callback: any) => {
          const sorted = data.sort((a: any, b: any) => {
            if (options?.ascending) {
              return a[orderField] > b[orderField] ? 1 : -1;
            }
            return a[orderField] < b[orderField] ? 1 : -1;
          });
          return callback({ data: sorted, error: null });
        }
      }),
      single: async () => {
        return { data: data[0] || null, error: null };
      },
      then: async (callback: any) => {
        return callback({ data, error: null });
      }
    }),
    insert: async (newData: any) => {
      const newId = Date.now().toString();
      const newItem = { id: newId, ...newData };
      data.push(newItem);
      return { data: [newItem], error: null };
    },
    update: (updateData: any) => ({
      eq: async (field: string, value: any) => {
        const index = data.findIndex((item: any) => item[field] === value);
        if (index !== -1) {
          data[index] = { ...data[index], ...updateData };
        }
        return { data: [data[index]], error: null };
      }
    }),
    delete: () => ({
      eq: async (field: string, value: any) => {
        const index = data.findIndex((item: any) => item[field] === value);
        if (index !== -1) {
          data.splice(index, 1);
        }
        return { data: [], error: null };
      }
    })
  };
};

// Database Service
export const dbService = {
  from: createQueryBuilder
};

// Storage Service
export const storageService = {
  from: (bucket: string) => ({
    upload: async (path: string, file: File) => {
      console.log('Mock upload:', bucket, path, file.name);
      return { data: { path: `${bucket}/${path}` }, error: null };
    },
    getPublicUrl: async (path: string) => {
      const url = `https://mock-storage.com/${bucket}/${path}`;
      return { data: { publicUrl: url } };
    }
  })
};

// Functions Service
export const functionsService = {
  invoke: async (functionName: string, params?: any) => {
    console.log('Mock function invoke:', functionName, params);
    return { data: { success: true }, error: null };
  }
};

// Export as supabase for compatibility
export const supabase = {
  auth: authService,
  from: dbService.from,
  storage: storageService,
  functions: functionsService,
  rpc: functionsService.invoke
};

export default supabase; 