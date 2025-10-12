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
  QueryConstraint,
  DocumentData,
  addDoc,
  serverTimestamp,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { db } from './firebase';

export class FirebaseQueryBuilder<T = DocumentData> {
  private collectionName: string;
  private constraints: QueryConstraint[] = [];
  private shouldReturnSingle = false;
  private pendingData: any = null;
  private pendingOperation: 'insert' | 'update' | 'upsert' | 'delete' | null = null;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  // Selection methods
  select(columns?: string) {
    // Firebase doesn't support field selection in the same way
    // This is here for compatibility
    return this;
  }

  // Filter methods
  eq(field: string, value: any) {
    this.constraints.push(where(field, '==', value));
    return this;
  }

  neq(field: string, value: any) {
    this.constraints.push(where(field, '!=', value));
    return this;
  }

  gt(field: string, value: any) {
    this.constraints.push(where(field, '>', value));
    return this;
  }

  gte(field: string, value: any) {
    this.constraints.push(where(field, '>=', value));
    return this;
  }

  lt(field: string, value: any) {
    this.constraints.push(where(field, '<', value));
    return this;
  }

  lte(field: string, value: any) {
    this.constraints.push(where(field, '<=', value));
    return this;
  }

  in(field: string, values: any[]) {
    this.constraints.push(where(field, 'in', values));
    return this;
  }

  contains(field: string, value: any) {
    this.constraints.push(where(field, 'array-contains', value));
    return this;
  }

  containedBy(field: string, value: any) {
    this.constraints.push(where(field, 'array-contains-any', value));
    return this;
  }

  // Text search methods (limited in Firestore)
  like(field: string, pattern: string) {
    // Firestore doesn't support LIKE queries
    // For prefix matching, we can use >= and <
    if (pattern.endsWith('%')) {
      const prefix = pattern.slice(0, -1);
      this.constraints.push(where(field, '>=', prefix));
      this.constraints.push(where(field, '<', prefix + '\uf8ff'));
    }
    return this;
  }

  ilike(field: string, pattern: string) {
    // Case-insensitive search requires a lowercase field in Firestore
    return this.like(field.toLowerCase(), pattern.toLowerCase());
  }

  // Additional filter methods
  is(field: string, value: any) {
    if (value === null) {
      this.constraints.push(where(field, '==', null));
    } else {
      this.constraints.push(where(field, '==', value));
    }
    return this;
  }

  or(filters: string) {
    // Firestore doesn't support OR queries in the same way
    // This would require using multiple queries and combining results
    console.warn('OR queries require special handling in Firestore');
    return this;
  }

  overlaps(field: string, value: any) {
    // For array overlap, use array-contains-any
    this.constraints.push(where(field, 'array-contains-any', value));
    return this;
  }

  range(field: string, from: any, to: any) {
    this.constraints.push(where(field, '>=', from));
    this.constraints.push(where(field, '<=', to));
    return this;
  }

  textSearch(field: string, searchTerm: string) {
    // Firestore doesn't support full-text search natively
    // This is a simple prefix search implementation
    const searchTermLower = searchTerm.toLowerCase();
    this.constraints.push(where(field, '>=', searchTermLower));
    this.constraints.push(where(field, '<', searchTermLower + '\uf8ff'));
    return this;
  }

  // Ordering
  order(field: string, options?: { ascending?: boolean }) {
    const direction = options?.ascending === false ? 'desc' : 'asc';
    this.constraints.push(orderBy(field, direction));
    return this;
  }

  // Limiting
  limit(count: number) {
    this.constraints.push(limit(count));
    return this;
  }

  // Single result methods
  single() {
    this.shouldReturnSingle = true;
    return this;
  }

  maybeSingle() {
    this.shouldReturnSingle = true;
    return this;
  }

  // Insert methods
  insert(data: Partial<T> | Partial<T>[]) {
    this.pendingData = data;
    this.pendingOperation = 'insert';
    return this;
  }

  // Update methods
  update(data: Partial<T>) {
    this.pendingData = data;
    this.pendingOperation = 'update';
    return this;
  }

  // Upsert methods
  upsert(data: Partial<T> | Partial<T>[]) {
    this.pendingData = data;
    this.pendingOperation = 'upsert';
    return this;
  }

  // Delete methods
  delete() {
    this.pendingOperation = 'delete';
    return this;
  }

  // Execute query
  async execute(): Promise<{ data: any; error: any }> {
    try {
      // Handle pending operations
      if (this.pendingOperation === 'insert') {
        const dataArray = Array.isArray(this.pendingData) ? this.pendingData : [this.pendingData];
        const results = [];

        for (const item of dataArray) {
          const docData = {
            ...item,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp()
          };
          const docRef = await addDoc(collection(db, this.collectionName), docData);
          const newDoc = await getDoc(docRef);
          results.push({ id: docRef.id, ...newDoc.data() });
        }

        return {
          data: this.shouldReturnSingle ? results[0] : results,
          error: null
        };
      }

      if (this.pendingOperation === 'update') {
        const q = query(collection(db, this.collectionName), ...this.constraints);
        const snapshot = await getDocs(q);
        const results = [];

        for (const docSnap of snapshot.docs) {
          const updateData = {
            ...this.pendingData,
            updated_at: serverTimestamp()
          };
          await updateDoc(doc(db, this.collectionName, docSnap.id), updateData);
          const updatedDoc = await getDoc(doc(db, this.collectionName, docSnap.id));
          results.push({ id: docSnap.id, ...updatedDoc.data() });
        }

        return {
          data: this.shouldReturnSingle ? results[0] : results,
          error: null
        };
      }

      if (this.pendingOperation === 'upsert') {
        const dataArray = Array.isArray(this.pendingData) ? this.pendingData : [this.pendingData];
        const results = [];

        for (const item of dataArray) {
          const { id, ...docData } = item as any;
          if (id) {
            await setDoc(doc(db, this.collectionName, id), {
              ...docData,
              updated_at: serverTimestamp()
            }, { merge: true });
            const updatedDoc = await getDoc(doc(db, this.collectionName, id));
            results.push({ id, ...updatedDoc.data() });
          } else {
            const newDocRef = await addDoc(collection(db, this.collectionName), {
              ...docData,
              created_at: serverTimestamp(),
              updated_at: serverTimestamp()
            });
            const newDoc = await getDoc(newDocRef);
            results.push({ id: newDocRef.id, ...newDoc.data() });
          }
        }

        return {
          data: this.shouldReturnSingle ? results[0] : results,
          error: null
        };
      }

      if (this.pendingOperation === 'delete') {
        const q = query(collection(db, this.collectionName), ...this.constraints);
        const snapshot = await getDocs(q);
        
        for (const docSnap of snapshot.docs) {
          await deleteDoc(doc(db, this.collectionName, docSnap.id));
        }

        return { data: null, error: null };
      }

      // Regular query
      const q = query(collection(db, this.collectionName), ...this.constraints);
      const snapshot = await getDocs(q);
      
      const results = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return {
        data: this.shouldReturnSingle ? results[0] || null : results,
        error: null
      };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Promise interface
  then<TResult1 = any, TResult2 = never>(
    onfulfilled?: ((value: any) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }

  catch<TResult = never>(
    onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
  ): Promise<any | TResult> {
    return this.execute().catch(onrejected);
  }

  finally(onfinally?: (() => void) | undefined | null): Promise<any> {
    return this.execute().finally(onfinally);
  }
}

// Realtime subscription helper
export const subscribeToCollection = (
  collectionName: string,
  constraints: QueryConstraint[],
  callback: (data: any[]) => void
): Unsubscribe => {
  const q = query(collection(db, collectionName), ...constraints);
  
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(data);
  });
};

// Export a supabase-compatible interface
export const firebaseDb = {
  from: (table: string) => new FirebaseQueryBuilder(table),
  
  // RPC function compatibility (needs custom implementation)
  rpc: async (functionName: string, params?: any) => {
    // This would need to be implemented with Cloud Functions
    console.warn(`RPC function ${functionName} called - implement with Cloud Functions`);
    return { data: null, error: null };
  },
  
  // Channel/realtime compatibility
  channel: (name: string) => ({
    on: (event: string, filter: any, callback: any) => ({
      subscribe: () => {
        // Implement with Firebase Realtime Database or Firestore listeners
        console.warn(`Channel ${name} subscription requested`);
        return {};
      }
    }),
    subscribe: (callback?: any) => {},
    unsubscribe: () => {},
  }),
};