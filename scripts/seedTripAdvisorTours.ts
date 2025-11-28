import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { tripAdvisorTours } from '../src/data/tripAdvisorTours'

/**
 * Seeds the TripAdvisor tours collection with Recharge-only listings.
 *
 * Collection: tours_tripadvisor
 * Fields: title, priceUsd, rating, reviews, region, location, duration, description, image, tripAdvisorUrl, badge, operator, operatorProfileUrl
 *
 * Usage:
 *  1) Ensure FIREBASE_CONFIG env vars are set or update firebaseConfig below.
 *  2) run: npx ts-node scripts/seedTripAdvisorTours.ts
 */
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || 'AIzaSyCxFnQfMo3rOWhgm1_yiRIh0Oez246U2N0',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || 'recharge-travels-73e76.firebaseapp.com',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'recharge-travels-73e76',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || 'recharge-travels-73e76.firebasestorage.app',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '515581447537',
  appId: process.env.VITE_FIREBASE_APP_ID || '1:515581447537:web:b4f65bf9c2544c65d6fad0'
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const COLLECTION = 'tours_tripadvisor'

async function seed() {
  console.log(`🚀 Seeding ${COLLECTION} with ${tripAdvisorTours.length} tours...`)

  for (const tour of tripAdvisorTours) {
    try {
      const ref = doc(db, COLLECTION, tour.id)
      await setDoc(ref, {
        ...tour,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true })
      console.log(`✅ Upserted: ${tour.title}`)
    } catch (err) {
      console.error(`❌ Failed for ${tour.title}:`, err)
    }
  }

  console.log('🎉 Done seeding TripAdvisor tours.')
  process.exit(0)
}

seed()
