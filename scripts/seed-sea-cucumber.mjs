import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const contentPath = resolve(__dirname, 'sea_cucumber_content.json');
const content = JSON.parse(readFileSync(contentPath, 'utf-8'));

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || 'AIzaSyCxFnQfMo3rOWhgm1_yiRIh0Oez246U2N0',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || 'recharge-travels-73e76.firebaseapp.com',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'recharge-travels-73e76',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || 'recharge-travels-73e76.firebasestorage.app',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '515581447537',
  appId: process.env.VITE_FIREBASE_APP_ID || '1:515581447537:web:b4f65bf9c2544c65d6fad0'
};

async function seed() {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  await setDoc(doc(db, 'pageContent', 'sea-cucumber-farming'), {
    ...content,
    updatedAt: new Date().toISOString()
  });
  console.log('✅ Sea cucumber content seeded');
}

seed().catch((err) => {
  console.error('❌ Failed to seed sea cucumber content', err);
  process.exit(1);
});
