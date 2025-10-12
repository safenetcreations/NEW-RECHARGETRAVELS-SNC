
import { getDocs, getDoc, collection, query, where, orderBy, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface NewsletterSubscription {
  email: string;
  name?: string;
  interests?: string[];
  source?: string;
}

export async function subscribeWildlifeNewsletter(
  subscription: NewsletterSubscription
) {
  try {
    // Check if email already exists
    const emailQuery = query(
      collection(db, 'newsletter_subscribers'),
      where('email', '==', subscription.email)
    );
    const emailSnapshot = await getDocs(emailQuery);
    
    if (!emailSnapshot.empty) {
      return { 
        data: null, 
        error: { message: 'Email already subscribed' } 
      };
    }

    const docRef = await addDoc(collection(db, 'newsletter_subscribers'), {
      email: subscription.email,
      name: subscription.name || '',
      subscribed_at: new Date().toISOString(),
      is_active: true
    });
    
    const docSnap = await getDoc(docRef);
    const data = { id: docSnap.id, ...docSnap.data() };

    // Send welcome email (you can implement this with Firebase Functions)
    await sendWelcomeEmail(subscription.email, subscription.name);

    return { data, error: null };
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Subscription failed') 
    };
  }
}

export async function unsubscribeNewsletter(email: string) {
  try {
    const emailQuery = query(
      collection(db, 'newsletter_subscribers'),
      where('email', '==', email)
    );
    const emailSnapshot = await getDocs(emailQuery);
    
    if (emailSnapshot.empty) {
      return { data: null, error: new Error('Email not found') };
    }
    
    const subscriberDoc = emailSnapshot.docs[0];
    await updateDoc(doc(db, 'newsletter_subscribers', subscriberDoc.id), {
      is_active: false,
      unsubscribed_at: new Date().toISOString()
    });
    
    const updatedDoc = await getDoc(doc(db, 'newsletter_subscribers', subscriberDoc.id));
    const data = { id: updatedDoc.id, ...updatedDoc.data() };
    
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function getNewsletterStats() {
  try {
    const q = query(
      collection(db, 'newsletter_subscribers'),
      orderBy('subscribed_at', 'desc')
    );
    const snapshot = await getDocs(q);
    const subscribers = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })) as any[];

    const totalSubscribers = subscribers.length;
    const activeSubscribers = subscribers.filter(sub => sub.is_active).length;
    const thisMonth = subscribers.filter(sub => {
      const subDate = new Date(sub.subscribed_at);
      const now = new Date();
      return subDate.getMonth() === now.getMonth() && 
             subDate.getFullYear() === now.getFullYear();
    }).length;

    return {
      data: {
        total: totalSubscribers,
        active: activeSubscribers,
        thisMonth: thisMonth,
        unsubscribed: totalSubscribers - activeSubscribers
      },
      error: null
    };
  } catch (error) {
    return { data: null, error };
  }
}

async function sendWelcomeEmail(email: string, name?: string) {
  try {
    // This would typically call a Firebase Function to send emails
    // For now, we'll just log it
    console.log('Sending welcome email to:', email, name);
    
    // TODO: Implement Firebase Function call
    // const { data, error } = await httpsCallable(functions, 'sendWelcomeEmail')({ email, name });
    
    return { data: null, error: null };
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return { data: null, error };
  }
}
