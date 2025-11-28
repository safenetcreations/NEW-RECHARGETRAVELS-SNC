// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCxFnQfMo3rOWhgm1_yiRIh0Oez246U2N0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "recharge-travels-73e76.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "recharge-travels-73e76",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "recharge-travels-73e76.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "515581447537",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:515581447537:web:b4f65bf9c2544c65d6fad0",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-W2MJBDFDG3"
};

// Initialize Firebase
let app;
let analytics;
let auth;
let db;
let storage;
let functions;

try {
  app = initializeApp(firebaseConfig);
  
  // Initialize Firebase services
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  functions = getFunctions(app);
  
  // Analytics only in browser environment
  if (typeof window !== 'undefined') {
    // analytics = getAnalytics(app); // Commented out to prevent premature initialization
  }
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  // Create empty objects to prevent crashes
  auth = null;
  db = null;
  storage = null;
  functions = null;
  analytics = null;
}

export { analytics, auth, db, storage, functions };
export default app;