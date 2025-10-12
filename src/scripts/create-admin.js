// This is a script to create an admin user
// Run this locally: node src/scripts/create-admin.js

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCxFnQfMo3rOWhgm1_yiRIh0Oez246U2N0",
  authDomain: "recharge-travels-73e76.firebaseapp.com",
  projectId: "recharge-travels-73e76",
  storageBucket: "recharge-travels-73e76.firebasestorage.app",
  messagingSenderId: "515581447537",
  appId: "1:515581447537:web:b4f65bf9c2544c65d6fad0",
  measurementId: "G-W2MJBDFDG3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function createAdminUser() {
  try {
    // Create user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      'admin@rechargetravels.com',
      'Admin123!'
    );

    // Set admin role in Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email: 'admin@rechargetravels.com',
      role: 'admin',
      createdAt: new Date(),
      name: 'Admin'
    });

    console.log('Admin user created successfully!');
    console.log('Email: admin@rechargetravels.com');
    console.log('Password: Admin123!');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

createAdminUser();