import { httpsCallable } from 'firebase/functions';
import { collection, addDoc, getDocs, query, where, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, functions } from '@/lib/firebase';

// Types
export interface NewsletterSubscription {
  email: string;
  name?: string;
  source?: 'blog' | 'footer' | 'homepage' | 'popup' | 'website';
  interests?: string[];
}

export interface SubscriptionResponse {
  success: boolean;
  message: string;
}

export interface NewsletterStats {
  total: number;
  active: number;
  unsubscribed: number;
  thisMonth: number;
  bySource: Record<string, number>;
}

// Newsletter Service
export const newsletterService = {
  /**
   * Subscribe to newsletter using Cloud Function
   * This handles duplicate checking and sends welcome email automatically
   */
  async subscribe(data: NewsletterSubscription): Promise<SubscriptionResponse> {
    try {
      const subscribeFunction = httpsCallable<NewsletterSubscription, SubscriptionResponse>(
        functions,
        'subscribeNewsletter'
      );
      const result = await subscribeFunction(data);
      return result.data;
    } catch (error: any) {
      console.error('Newsletter subscription error:', error);

      // Fallback to direct Firestore if function fails
      return this.subscribeDirectly(data);
    }
  },

  /**
   * Direct Firestore subscription (fallback)
   */
  async subscribeDirectly(data: NewsletterSubscription): Promise<SubscriptionResponse> {
    try {
      // Check if email already exists
      const emailQuery = query(
        collection(db, 'newsletter_subscribers'),
        where('email', '==', data.email.toLowerCase())
      );
      const emailSnapshot = await getDocs(emailQuery);

      if (!emailSnapshot.empty) {
        const existingDoc = emailSnapshot.docs[0];
        const existingData = existingDoc.data();

        // Reactivate if previously unsubscribed
        if (!existingData.is_active) {
          await updateDoc(doc(db, 'newsletter_subscribers', existingDoc.id), {
            is_active: true,
            resubscribed_at: serverTimestamp(),
            name: data.name || existingData.name
          });
          return { success: true, message: 'Welcome back! You have been resubscribed.' };
        }

        return { success: false, message: 'This email is already subscribed.' };
      }

      // Create new subscriber
      await addDoc(collection(db, 'newsletter_subscribers'), {
        email: data.email.toLowerCase(),
        name: data.name || '',
        source: data.source || 'website',
        interests: data.interests || [],
        is_active: true,
        blog_notifications: true,
        subscribed_at: serverTimestamp()
      });

      return { success: true, message: 'Successfully subscribed to our newsletter!' };
    } catch (error: any) {
      console.error('Direct subscription error:', error);
      return { success: false, message: 'Subscription failed. Please try again.' };
    }
  },

  /**
   * Unsubscribe from newsletter
   */
  async unsubscribe(email: string): Promise<SubscriptionResponse> {
    try {
      const unsubscribeFunction = httpsCallable<{ email: string }, SubscriptionResponse>(
        functions,
        'unsubscribeNewsletter'
      );
      const result = await unsubscribeFunction({ email });
      return result.data;
    } catch (error: any) {
      console.error('Newsletter unsubscription error:', error);

      // Fallback to direct Firestore
      try {
        const emailQuery = query(
          collection(db, 'newsletter_subscribers'),
          where('email', '==', email.toLowerCase())
        );
        const emailSnapshot = await getDocs(emailQuery);

        if (emailSnapshot.empty) {
          return { success: false, message: 'Email not found in our subscriber list.' };
        }

        const subscriberDoc = emailSnapshot.docs[0];
        await updateDoc(doc(db, 'newsletter_subscribers', subscriberDoc.id), {
          is_active: false,
          unsubscribed_at: serverTimestamp()
        });

        return { success: true, message: 'You have been unsubscribed from our newsletter.' };
      } catch (fbError) {
        return { success: false, message: 'Unsubscription failed. Please try again.' };
      }
    }
  },

  /**
   * Get newsletter statistics (admin)
   */
  async getStats(): Promise<NewsletterStats | null> {
    try {
      const getStatsFunction = httpsCallable<void, { success: boolean; stats: NewsletterStats }>(
        functions,
        'getNewsletterStats'
      );
      const result = await getStatsFunction();
      return result.data.stats;
    } catch (error) {
      console.error('Get stats error:', error);
      return null;
    }
  },

  /**
   * Check if email is subscribed
   */
  async isSubscribed(email: string): Promise<boolean> {
    try {
      const emailQuery = query(
        collection(db, 'newsletter_subscribers'),
        where('email', '==', email.toLowerCase()),
        where('is_active', '==', true)
      );
      const emailSnapshot = await getDocs(emailQuery);
      return !emailSnapshot.empty;
    } catch (error) {
      console.error('Check subscription error:', error);
      return false;
    }
  }
};

export default newsletterService;
