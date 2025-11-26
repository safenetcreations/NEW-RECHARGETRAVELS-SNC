import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { phase1Pages } from '../src/data/phase1-content.js';

// Firebase configuration
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

async function populatePhase1Pages() {
  console.log('🚀 Starting Phase 1 Page Population...');
  
  try {
    for (const page of phase1Pages) {
      console.log(`📝 Processing page: ${page.title}`);
      
      // Add timestamps
      const pageWithTimestamps = {
        ...page,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'admin'
      };
      
      // Save to Firestore
      const docRef = doc(db, 'pages', page.id);
      await setDoc(docRef, pageWithTimestamps);
      
      console.log(`✅ Successfully saved: ${page.title}`);
    }
    
    console.log('🎉 Phase 1 Page Population Complete!');
    console.log(`📊 Total pages processed: ${phase1Pages.length}`);
    
    // Summary
    console.log('\n📋 Pages Updated:');
    phase1Pages.forEach(page => {
      console.log(`  • ${page.title} (${page.slug})`);
    });
    
  } catch (error) {
    console.error('❌ Error populating pages:', error);
    throw error;
  }
}

// Run the script
populatePhase1Pages()
  .then(() => {
    console.log('✅ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }); 