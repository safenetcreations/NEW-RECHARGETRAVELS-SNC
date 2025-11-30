import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { jaffnaDestinationContent } from '../src/data/destinations/jaffnaContent';

/**
 * Seeds the destinations/jaffna document with the curated Recharge Travels content.
 *
 * Usage:
 *   FIREBASE_CONFIG env vars optional (falls back to production defaults)
 *   npx ts-node scripts/seedDestinationJaffna.ts
 */
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || 'AIzaSyCxFnQfMo3rOWhgm1_yiRIh0Oez246U2N0',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || 'recharge-travels-73e76.firebaseapp.com',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'recharge-travels-73e76',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || 'recharge-travels-73e76.firebasestorage.app',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '515581447537',
  appId: process.env.VITE_FIREBASE_APP_ID || '1:515581447537:web:b4f65bf9c2544c65d6fad0'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedJaffnaDestination() {
  console.log('🚀 Seeding destinations/jaffna document...');
  try {
    const docRef = doc(db, 'destinations', 'jaffna');
    const payload = {
      ...jaffnaDestinationContent,
      id: 'jaffna',
      slug: 'jaffna',
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    };

    await setDoc(docRef, payload, { merge: true });
    console.log('✅ Upserted destinations/jaffna with curated content.');
  } catch (error) {
    console.error('❌ Failed to seed Jaffna destination:', error);
    process.exit(1);
  }

  process.exit(0);
}

seedJaffnaDestination();
