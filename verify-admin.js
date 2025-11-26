import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

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
const db = getFirestore(app);

const userId = 'IVCcgIlGGJYP5TmCJUcZBGgXI073';

async function verifyAdminDocuments() {
  console.log('🔍 Verifying admin documents for user:', userId);
  
  try {
    // Check profiles collection
    const profileDoc = await getDoc(doc(db, 'profiles', userId));
    console.log('📋 Profile document exists:', profileDoc.exists());
    if (profileDoc.exists()) {
      console.log('📋 Profile data:', profileDoc.data());
    }
    
    // Check admins collection
    const adminDoc = await getDoc(doc(db, 'admins', userId));
    console.log('👑 Admin document exists:', adminDoc.exists());
    if (adminDoc.exists()) {
      console.log('👑 Admin data:', adminDoc.data());
    }
    
    if (!profileDoc.exists() || !adminDoc.exists()) {
      console.log('❌ Missing admin documents!');
      console.log('Creating missing documents...');
      
      // Create the missing documents
      const { setDoc } = await import('firebase/firestore');
      
      if (!profileDoc.exists()) {
        await setDoc(doc(db, 'profiles', userId), {
          id: userId,
          email: 'nanthan@rechargetravels.com',
          is_admin: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          role: 'admin'
        });
        console.log('✅ Profile document created');
      }
      
      if (!adminDoc.exists()) {
        await setDoc(doc(db, 'admins', userId), {
          email: 'nanthan@rechargetravels.com',
          isAdmin: true,
          createdAt: new Date().toISOString(),
          role: 'super_admin',
          permissions: ['read', 'write', 'delete', 'admin'],
          lastLogin: null
        });
        console.log('✅ Admin document created');
      }
    } else {
      console.log('✅ All admin documents exist!');
    }
    
  } catch (error) {
    console.error('❌ Error verifying admin documents:', error);
  }
}

verifyAdminDocuments(); 