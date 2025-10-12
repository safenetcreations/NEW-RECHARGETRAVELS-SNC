import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import teaTrailsData from '../data/seed-tea-trails.json';

// Firebase configuration - replace with your config
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedTeaTrailsData() {
  try {
    console.log('Starting to seed Tea Trails data...');
    
    // Add the tea trails experience data
    const docRef = doc(db, 'experiences', 'tea-trails');
    await setDoc(docRef, teaTrailsData);
    
    console.log('✅ Tea Trails data seeded successfully!');
    
    // Optionally, add some sample tours
    const sampleTours = [
      {
        experienceSlug: 'tea-trails',
        title: 'Ultimate Tea Trail Experience',
        thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&auto=format&fit=crop',
        badges: ['Bestseller', 'Small Group'],
        duration: '3 Days',
        salePriceUSD: 299,
        regularPriceUSD: 399,
        highlights: ['3 Tea Estates', 'Factory Tours', 'Tea Plucking', 'Colonial Stays'],
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        experienceSlug: 'tea-trails',
        title: 'Nuwara Eliya Tea Discovery',
        thumbnail: 'https://images.unsplash.com/photo-1589456506629-b2ea1a8576fb?w=400&h=300&auto=format&fit=crop',
        badges: ['Popular'],
        duration: '2 Days',
        salePriceUSD: 189,
        regularPriceUSD: null,
        highlights: ['Pedro Estate', 'High Tea', 'City Tour', 'Lake Views'],
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        experienceSlug: 'tea-trails',
        title: "Lipton's Seat Adventure",
        thumbnail: 'https://images.unsplash.com/photo-1606820854416-439b3305ff39?w=400&h=300&auto=format&fit=crop',
        badges: ['Adventure'],
        duration: '1 Day',
        salePriceUSD: 89,
        regularPriceUSD: null,
        highlights: ['Sunrise Trek', 'Dambatenne Factory', 'Tea Tasting', 'Scenic Drive'],
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    // Add sample tours
    console.log('Adding sample tours...');
    for (const tour of sampleTours) {
      const tourRef = doc(db, 'tours', `tea-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
      await setDoc(tourRef, tour);
    }
    
    console.log('✅ Sample tours added successfully!');
    console.log('🎉 All data seeded successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    process.exit();
  }
}

// Run the seeding function
seedTeaTrailsData();