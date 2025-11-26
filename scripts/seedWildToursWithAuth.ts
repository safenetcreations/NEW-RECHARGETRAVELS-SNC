import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
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
const auth = getAuth(app);

async function seedWildTours() {
  console.log('🌿 Starting Wild Tours data seeding with authentication...\n');

  // Prompt for admin credentials
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (prompt: string): Promise<string> => {
    return new Promise((resolve) => {
      readline.question(prompt, resolve);
    });
  };

  try {
    console.log('Please enter your admin credentials:');
    const email = await question('Email: ');
    const password = await question('Password: ');

    console.log('\n🔐 Signing in...');
    await signInWithEmailAndPassword(auth, email, password);
    console.log('✅ Successfully authenticated!\n');

    const wildToursCollection = collection(db, 'wildTours');
    let successCount = 0;
    let errorCount = 0;

    for (const [category, tours] of Object.entries(wildToursData)) {
      console.log(`📦 Processing category: ${category}`);

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
  } catch (error: any) {
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
      console.error('\n❌ Authentication failed. Please check your credentials.');
      console.error('   Make sure you have an admin account in Firebase Authentication.');
    } else {
      console.error('\n❌ Error during seeding:', error);
    }
  } finally {
    readline.close();
    process.exit(0);
  }
}

// Run the seed function
seedWildTours();
