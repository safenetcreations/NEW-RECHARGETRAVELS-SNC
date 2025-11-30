import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCxFnQfMo3rOWhgm1_yiRIh0Oez246U2N0',
  authDomain: 'recharge-travels-73e76.firebaseapp.com',
  projectId: 'recharge-travels-73e76',
  storageBucket: 'recharge-travels-73e76.firebasestorage.app',
  messagingSenderId: '515581447537',
  appId: '1:515581447537:web:b4f65bf9c2544c65d6fad0'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const drivers = [
  {
    name: 'Chaminda Perera',
    type: 'chauffeur_guide',
    email: 'chaminda@rechargetravels.com',
    phone: '+94 77 123 4567',
    languages: ['English', 'German', 'French', 'Sinhala'],
    experience: 15,
    rating: 4.9,
    average_rating: 4.9,
    reviewCount: 156,
    total_reviews: 156,
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    bio: 'Professional chauffeur guide with 15 years of experience. Specialized in cultural and heritage tours across Sri Lanka.',
    specializations: ['Cultural Tours', 'Heritage Sites', 'Photography Tours'],
    vehicleTypes: ['Luxury Sedan', 'SUV', 'Van'],
    location: 'Colombo',
    isAvailable: true,
    isVerified: true,
    status: 'approved',
    current_status: 'verified',
    tier: 'gold',
    createdAt: Timestamp.now()
  },
  {
    name: 'Suresh Kumar',
    type: 'national_guide',
    email: 'suresh@rechargetravels.com',
    phone: '+94 77 234 5678',
    languages: ['English', 'Tamil', 'Hindi', 'Sinhala'],
    experience: 10,
    rating: 4.8,
    average_rating: 4.8,
    reviewCount: 89,
    total_reviews: 89,
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    bio: 'Certified national guide with expertise in wildlife and nature tours. Expert in Yala and Wilpattu national parks.',
    specializations: ['Wildlife Safari', 'Bird Watching', 'Nature Tours'],
    vehicleTypes: ['Jeep', 'SUV'],
    location: 'Kandy',
    isAvailable: true,
    isVerified: true,
    status: 'approved',
    current_status: 'verified',
    tier: 'gold',
    createdAt: Timestamp.now()
  },
  {
    name: 'Nimal Jayawardena',
    type: 'tourist_driver',
    email: 'nimal@rechargetravels.com',
    phone: '+94 77 345 6789',
    languages: ['English', 'Sinhala'],
    experience: 12,
    rating: 4.7,
    average_rating: 4.7,
    reviewCount: 234,
    total_reviews: 234,
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    bio: 'Experienced tourist driver with excellent knowledge of Sri Lankan roads and attractions. Safe and reliable service.',
    specializations: ['Airport Transfers', 'Day Tours', 'Multi-day Tours'],
    vehicleTypes: ['Sedan', 'Van', 'Mini Bus'],
    location: 'Negombo',
    isAvailable: true,
    isVerified: true,
    status: 'approved',
    current_status: 'verified',
    tier: 'silver',
    createdAt: Timestamp.now()
  },
  {
    name: 'Lakshmi Fernando',
    type: 'chauffeur_guide',
    email: 'lakshmi@rechargetravels.com',
    phone: '+94 77 456 7890',
    languages: ['English', 'Japanese', 'Mandarin', 'Sinhala'],
    experience: 8,
    rating: 4.95,
    average_rating: 4.95,
    reviewCount: 78,
    total_reviews: 78,
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    bio: 'Female chauffeur guide specializing in luxury tours and Asian language services. Perfect for Japanese and Chinese tourists.',
    specializations: ['Luxury Tours', 'Wellness Retreats', 'Tea Trails'],
    vehicleTypes: ['Luxury Sedan', 'Premium SUV'],
    location: 'Colombo',
    isAvailable: true,
    isVerified: true,
    status: 'approved',
    current_status: 'verified',
    tier: 'platinum',
    createdAt: Timestamp.now()
  },
  {
    name: 'Roshan Silva',
    type: 'freelance_driver',
    email: 'roshan@rechargetravels.com',
    phone: '+94 77 567 8901',
    languages: ['English', 'Sinhala'],
    experience: 5,
    rating: 4.5,
    average_rating: 4.5,
    reviewCount: 45,
    total_reviews: 45,
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    bio: 'Friendly freelance driver offering affordable rates for short trips and airport transfers. Great for budget travelers.',
    specializations: ['Airport Transfers', 'City Tours', 'Short Trips'],
    vehicleTypes: ['Sedan', 'Hatchback'],
    location: 'Galle',
    isAvailable: true,
    isVerified: true,
    status: 'approved',
    current_status: 'verified',
    tier: 'bronze',
    createdAt: Timestamp.now()
  },
  {
    name: 'Arjuna Bandara',
    type: 'chauffeur_guide',
    email: 'arjuna@rechargetravels.com',
    phone: '+94 77 678 9012',
    languages: ['English', 'German', 'Sinhala'],
    experience: 20,
    rating: 4.85,
    average_rating: 4.85,
    reviewCount: 167,
    total_reviews: 167,
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
    bio: 'Safari specialist with 20 years experience in Yala and Udawalawe national parks. Expert wildlife spotter.',
    specializations: ['Wildlife Safari', 'National Parks', 'Adventure Tours'],
    vehicleTypes: ['Safari Jeep', '4x4 SUV'],
    location: 'Tissamaharama',
    isAvailable: true,
    isVerified: true,
    status: 'approved',
    current_status: 'verified',
    tier: 'gold',
    createdAt: Timestamp.now()
  }
];

async function seedDrivers() {
  console.log('🚗 Seeding 6 drivers to Firebase Firestore...\n');
  
  for (const driver of drivers) {
    try {
      const docRef = await addDoc(collection(db, 'drivers'), driver);
      console.log(`✅ Added: ${driver.name} (${driver.type}) - ID: ${docRef.id}`);
    } catch (error) {
      console.error(`❌ Error adding ${driver.name}:`, error.message);
    }
  }
  
  console.log('\n🎉 Done! Check https://www.rechargetravels.com/drivers');
  process.exit(0);
}

seedDrivers();
