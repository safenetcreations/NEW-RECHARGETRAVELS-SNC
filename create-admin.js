import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc 
} from 'firebase/firestore';

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
  const email = 'nanthan@rechargetravels.com';
  const password = 'Ellalan@2016';

  console.log('🔐 Creating admin user...');
  console.log(`📧 Email: ${email}`);
  console.log(`🔑 Password: ${password}`);
  console.log('');

  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log('✅ User created in Firebase Authentication');
    console.log(`🆔 User ID: ${user.uid}`);

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

    // Create user profile
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
    console.log(`🔑 Password: ${password}`);
    console.log(`🆔 User ID: ${user.uid}`);
    console.log(`🔗 Admin Panel: https://recharge-travels-73e76-admin.web.app`);
    console.log(`🔗 Main Site: https://recharge-travels-73e76.web.app`);
    console.log(`📊 Firebase Console: https://console.firebase.google.com/project/recharge-travels-73e76`);

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    
    if (error.code === 'auth/email-already-in-use') {
      console.log('\n⚠️  User already exists!');
      console.log('You can now login to the admin panel with these credentials:');
      console.log(`📧 Email: ${email}`);
      console.log(`🔑 Password: ${password}`);
      console.log(`🔗 Admin Panel: https://recharge-travels-73e76-admin.web.app`);
    }
  }
}

createAdminUser(); 