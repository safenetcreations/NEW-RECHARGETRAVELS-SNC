
import { getDocs, getDoc, collection, query, where, orderBy, addDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '@/lib/firebase';

export async function getWildlifeReviews(itemType: string, itemId?: string) {
  try {
    let q = query(
      collection(db, 'wildlife_reviews'),
      where('item_type', '==', itemType),
      orderBy('created_at', 'desc')
    );

    if (itemId) {
      q = query(
        collection(db, 'wildlife_reviews'),
        where('item_type', '==', itemType),
        where('item_id', '==', itemId),
        orderBy('created_at', 'desc')
      );
    }

    const snapshot = await getDocs(q);
    const reviews = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })) as any[];
    
    // Fetch user profiles for each review
    const reviewsWithProfiles = await Promise.all(
      reviews.map(async (review) => {
        if (review.user_id) {
          const profileDoc = await getDoc(doc(db, 'profiles', review.user_id));
          if (profileDoc.exists()) {
            review.profiles = { id: profileDoc.id, ...profileDoc.data() };
          }
        }
        return review;
      })
    );
    
    return { data: reviewsWithProfiles, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function createWildlifeReview(reviewData: {
  booking_id: string;
  item_type: string;
  item_id?: string;
  rating: number;
  title?: string;
  comment?: string;
  photos?: string[];
}) {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      return { data: null, error: new Error('User must be logged in') };
    }

    const docRef = await addDoc(collection(db, 'wildlife_reviews'), {
      user_id: user.uid,
      ...reviewData,
      photos: reviewData.photos || [],
      created_at: new Date().toISOString()
    });
    
    const docSnap = await getDoc(docRef);
    const data = { id: docSnap.id, ...docSnap.data() };
    
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
