
import { addDoc, collection, getDoc } from 'firebase/firestore';
import { db } from '@/services/firebaseService';

export async function createInquiry(inquiryData: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  inquiry_type?: 'general' | 'booking' | 'support' | 'partnership';
}) {
  try {
    const docRef = await addDoc(collection(db, 'inquiries'), {
      ...inquiryData,
      inquiry_type: inquiryData.inquiry_type || 'general',
      status: 'new',
      created_at: new Date().toISOString()
    });
    
    const docSnap = await getDoc(docRef);
    const data = { id: docSnap.id, ...docSnap.data() };
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
