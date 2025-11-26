#!/usr/bin/env node

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updatePassword 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc 
} from 'firebase/firestore';
import readline from 'readline';

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
const auth = getAuth(app);
const db = getFirestore(app);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupAdminUser() {
  console.log('🔐 Firebase Admin Authentication Setup\n');
  console.log('This script will create an admin user in Firebase Authentication');
  console.log('and set up admin privileges in Firestore.\n');

  try {
    // Get admin credentials
    const email = await question('Enter admin email: ');
    const password = await question('Enter admin password (min 6 characters): ');
    const confirmPassword = await question('Confirm admin password: ');

    if (password !== confirmPassword) {
      console.log('❌ Passwords do not match!');
      rl.close();
      return;
    }

    if (password.length < 6) {
      console.log('❌ Password must be at least 6 characters long!');
      rl.close();
      return;
    }

    console.log('\n🔄 Creating admin user...');

    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log('✅ User created in Firebase Authentication');

    // Set admin privileges in Firestore
    await setDoc(doc(db, 'admins', user.uid), {
      email: user.email,
      isAdmin: true,
      createdAt: new Date().toISOString(),
      role: 'super_admin',
      permissions: ['read', 'write', 'delete', 'admin'],
      lastLogin: null
    });

    console.log('✅ Admin privileges set in Firestore');

    // Also create a user profile
    await setDoc(doc(db, 'profiles', user.uid), {
      id: user.uid,
      email: user.email,
      is_admin: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      role: 'admin'
    });

    console.log('✅ User profile created');

    console.log('\n🎉 Admin user setup complete!');
    console.log(`📧 Email: ${email}`);
    console.log(`🆔 User ID: ${user.uid}`);
    console.log(`🔗 Admin Panel: https://recharge-travels-73e76-admin.web.app`);
    console.log(`🔗 Main Site: https://recharge-travels-73e76.web.app`);

  } catch (error) {
    console.error('❌ Error setting up admin user:', error.message);
    
    if (error.code === 'auth/email-already-in-use') {
      console.log('\n⚠️  User already exists. Would you like to update the password?');
      const updatePassword = await question('Enter new password (or press Enter to skip): ');
      
      if (updatePassword) {
        try {
          // Sign in to update password
          const signInResult = await signInWithEmailAndPassword(auth, email, await question('Enter current password: '));
          await updatePassword(signInResult.user, updatePassword);
          console.log('✅ Password updated successfully!');
        } catch (updateError) {
          console.error('❌ Error updating password:', updateError.message);
        }
      }
    }
  } finally {
    rl.close();
  }
}

async function listAdminUsers() {
  console.log('👥 Listing admin users...\n');
  
  try {
    // This would require admin SDK in production
    // For now, we'll show the structure
    console.log('Admin users are stored in:');
    console.log('- Firebase Authentication');
    console.log('- Firestore collection: admins');
    console.log('- Firestore collection: profiles (with is_admin: true)');
    
  } catch (error) {
    console.error('❌ Error listing admin users:', error.message);
  }
}

async function main() {
  const action = await question('Choose action:\n1. Create new admin user\n2. List admin users\nEnter choice (1 or 2): ');

  switch (action) {
    case '1':
      await setupAdminUser();
      break;
    case '2':
      await listAdminUsers();
      break;
    default:
      console.log('❌ Invalid choice');
      rl.close();
  }
}

main().catch(console.error); 