import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { wildToursData } from '../src/data/wildToursData';

const firebaseConfig = {
  apiKey: "AIzaSyCxFnQfMo3rOWhgm1_yiRIh0Oez246U2N0",
  authDomain: "recharge-travels-73e76.firebaseapp.com",
  projectId: "recharge-travels-73e76",
  storageBucket: "recharge-travels-73e76.firebasestorage.app",
  messagingSenderId: "515581447537",
  appId: "1:515581447537:web:b4f65bf9c2544c65d6fad0",
  measurementId: "G-W2MJBDFDG3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedWildTours() {
  console.log('🌿 Starting Wild Tours data seeding...');

  const wildToursCollection = collection(db, 'wildTours');
  let successCount = 0;
  let errorCount = 0;

  try {
    for (const [category, tours] of Object.entries(wildToursData)) {
      console.log(`\n📦 Processing category: ${category}`);

      for (const tour of tours) {
        try {
          const tourData = {
            ...tour,
            category,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
            isActive: true
          };

          await addDoc(wildToursCollection, tourData);
          console.log(`  ✅ Added: ${tour.title}`);
          successCount++;
        } catch (error) {
          console.error(`  ❌ Error adding ${tour.title}:`, error);
          errorCount++;
        }
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`🎉 Seeding completed!`);
    console.log(`✅ Successfully added: ${successCount} tours`);
    if (errorCount > 0) {
      console.log(`❌ Errors: ${errorCount} tours`);
    }
    console.log('='.repeat(50));
  } catch (error) {
    console.error('❌ Fatal error during seeding:', error);
  }

  process.exit(0);
}

// Run the seed function
seedWildTours();
