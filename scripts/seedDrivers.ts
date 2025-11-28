/**
 * Seed Sample Drivers for Testing
 * Run with: npx ts-node scripts/seedDrivers.ts
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin
const serviceAccount = require('../serviceAccountKey.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

const sampleDrivers = [
  {
    id: 'driver_001',
    user_id: 'user_driver_001',
    full_name: 'Chaminda Perera',
    email: 'chaminda@example.com',
    phone: '+94 77 123 4567',
    tier: 'chauffeur_guide',
    sltda_license_number: 'SLTDA/CG/2024/001',
    sltda_license_expiry: '2026-12-31',
    drivers_license_number: 'DL2024001234',
    drivers_license_expiry: '2027-06-30',
    national_id_number: '198512345678',
    years_experience: 15,
    current_status: 'verified',
    verified_level: 3,
    verification_date: '2024-01-15',
    biography: 'With over 15 years of experience exploring every corner of Sri Lanka, I specialize in creating unforgettable journeys for travelers seeking authentic cultural experiences. As a certified Chauffeur Tourist Guide, I combine safe, comfortable driving with deep knowledge of Sri Lankan history, wildlife, and hidden gems. Fluent in English, German, and French, I can share stories that bring each destination to life.',
    specialty_languages: ['English', 'German', 'French', 'Sinhala'],
    employment_mode: 'gig',
    hourly_rate: 25,
    daily_rate: 150,
    vehicle_preference: 'own_vehicle',
    is_guide: true,
    is_chauffeur: true,
    is_sltda_approved: true,
    profile_photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    average_rating: 4.9,
    total_reviews: 156,
    completion_rate: 99,
    vehicle_type: 'suv',
    vehicle_make: 'Toyota',
    vehicle_model: 'Land Cruiser Prado',
    vehicle_year: 2022,
    vehicle_features: ['Air Conditioning', 'WiFi', 'Cooler Box', 'USB Charging', 'First Aid Kit'],
    service_areas: ['Colombo', 'Kandy', 'Galle', 'Ella', 'Sigiriya', 'Yala'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'driver_002',
    user_id: 'user_driver_002',
    full_name: 'Suresh Kumar',
    email: 'suresh@example.com',
    phone: '+94 71 234 5678',
    tier: 'national_guide',
    sltda_license_number: 'SLTDA/NG/2023/045',
    sltda_license_expiry: '2025-08-15',
    drivers_license_number: 'DL2023005678',
    drivers_license_expiry: '2026-12-31',
    national_id_number: '199087654321',
    years_experience: 8,
    current_status: 'verified',
    verified_level: 3,
    verification_date: '2023-08-20',
    biography: 'As a National Tourist Guide Lecturer, I specialize in leading groups through Sri Lanka\'s UNESCO World Heritage Sites. My expertise lies in ancient history, archaeology, and Buddhist heritage. I\'ve guided over 500 tour groups and pride myself on making history come alive for visitors of all ages.',
    specialty_languages: ['English', 'Tamil', 'Hindi', 'Sinhala'],
    employment_mode: 'contract',
    hourly_rate: 20,
    daily_rate: 120,
    vehicle_preference: 'company_vehicle',
    is_guide: true,
    is_chauffeur: false,
    is_sltda_approved: true,
    profile_photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    average_rating: 4.8,
    total_reviews: 89,
    completion_rate: 98,
    vehicle_type: 'van',
    vehicle_make: 'Toyota',
    vehicle_model: 'KDH',
    vehicle_year: 2021,
    vehicle_features: ['Air Conditioning', 'PA System', 'Cooler Box', 'First Aid Kit'],
    service_areas: ['Anuradhapura', 'Polonnaruwa', 'Sigiriya', 'Dambulla', 'Kandy'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'driver_003',
    user_id: 'user_driver_003',
    full_name: 'Nimal Jayawardena',
    email: 'nimal@example.com',
    phone: '+94 76 345 6789',
    tier: 'tourist_driver',
    sltda_license_number: 'SLTDA/TD/2024/112',
    sltda_license_expiry: '2026-03-20',
    drivers_license_number: 'DL2022009876',
    drivers_license_expiry: '2025-09-15',
    national_id_number: '198756781234',
    years_experience: 12,
    current_status: 'verified',
    verified_level: 2,
    verification_date: '2024-03-25',
    biography: 'SLITHM-trained professional tourist driver with 12 years of experience navigating Sri Lanka\'s diverse terrains. I specialize in hill country tours and wildlife safaris. Safety and comfort are my top priorities, and I take pride in maintaining my vehicle to the highest standards.',
    specialty_languages: ['English', 'Sinhala'],
    employment_mode: 'gig',
    hourly_rate: 15,
    daily_rate: 90,
    vehicle_preference: 'own_vehicle',
    is_guide: false,
    is_chauffeur: true,
    is_sltda_approved: true,
    profile_photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    average_rating: 4.7,
    total_reviews: 234,
    completion_rate: 97,
    vehicle_type: 'sedan',
    vehicle_make: 'Toyota',
    vehicle_model: 'Axio',
    vehicle_year: 2020,
    vehicle_features: ['Air Conditioning', 'WiFi', 'USB Charging', 'Child Seat Available'],
    service_areas: ['Colombo', 'Negombo', 'Kandy', 'Nuwara Eliya', 'Ella'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'driver_004',
    user_id: 'user_driver_004',
    full_name: 'Lakshmi Fernando',
    email: 'lakshmi@example.com',
    phone: '+94 70 456 7890',
    tier: 'chauffeur_guide',
    sltda_license_number: 'SLTDA/CG/2022/078',
    sltda_license_expiry: '2025-11-30',
    drivers_license_number: 'DL2020003456',
    drivers_license_expiry: '2026-04-20',
    national_id_number: '199234567890',
    years_experience: 6,
    current_status: 'verified',
    verified_level: 3,
    verification_date: '2022-12-10',
    biography: 'As one of the few female chauffeur guides in Sri Lanka, I bring a unique perspective to tourism. I specialize in wellness tours, tea plantation visits, and cultural immersion experiences. Fluent in Japanese and Mandarin, I cater to Asian travelers looking for personalized experiences.',
    specialty_languages: ['English', 'Japanese', 'Mandarin', 'Sinhala'],
    employment_mode: 'gig',
    hourly_rate: 22,
    daily_rate: 130,
    vehicle_preference: 'own_vehicle',
    is_guide: true,
    is_chauffeur: true,
    is_sltda_approved: true,
    profile_photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face',
    average_rating: 4.95,
    total_reviews: 78,
    completion_rate: 100,
    vehicle_type: 'suv',
    vehicle_make: 'Honda',
    vehicle_model: 'CR-V',
    vehicle_year: 2023,
    vehicle_features: ['Air Conditioning', 'WiFi', 'Premium Sound System', 'Cooler Box', 'Umbrella'],
    service_areas: ['Colombo', 'Nuwara Eliya', 'Kandy', 'Galle', 'Bentota'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'driver_005',
    user_id: 'user_driver_005',
    full_name: 'Roshan Silva',
    email: 'roshan@example.com',
    phone: '+94 78 567 8901',
    tier: 'freelance_driver',
    drivers_license_number: 'DL2021007890',
    drivers_license_expiry: '2026-07-10',
    national_id_number: '199567890123',
    years_experience: 4,
    current_status: 'verified',
    verified_level: 1,
    verification_date: '2024-06-15',
    biography: 'Reliable and punctual driver for airport transfers and city tours. I know Colombo inside out and can navigate through traffic efficiently. Available 24/7 for pickups and drop-offs.',
    specialty_languages: ['English', 'Sinhala'],
    employment_mode: 'gig',
    hourly_rate: 10,
    daily_rate: 60,
    vehicle_preference: 'own_vehicle',
    is_guide: false,
    is_chauffeur: false,
    is_sltda_approved: false,
    profile_photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
    average_rating: 4.5,
    total_reviews: 45,
    completion_rate: 94,
    vehicle_type: 'sedan',
    vehicle_make: 'Toyota',
    vehicle_model: 'Prius',
    vehicle_year: 2019,
    vehicle_features: ['Air Conditioning', 'USB Charging'],
    service_areas: ['Colombo', 'Negombo', 'Airport'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'driver_006',
    user_id: 'user_driver_006',
    full_name: 'Arjuna Bandara',
    email: 'arjuna@example.com',
    phone: '+94 72 678 9012',
    tier: 'tourist_driver',
    sltda_license_number: 'SLTDA/TD/2023/089',
    sltda_license_expiry: '2025-05-20',
    drivers_license_number: 'DL2019002345',
    drivers_license_expiry: '2025-11-30',
    national_id_number: '198890123456',
    years_experience: 10,
    current_status: 'verified',
    verified_level: 2,
    verification_date: '2023-06-10',
    biography: 'Safari specialist with extensive experience in Yala, Udawalawe, and Wilpattu national parks. My comfortable safari jeep and knowledge of wildlife behavior ensure the best wildlife sighting experiences for my guests.',
    specialty_languages: ['English', 'German', 'Sinhala'],
    employment_mode: 'gig',
    hourly_rate: 18,
    daily_rate: 100,
    vehicle_preference: 'own_vehicle',
    is_guide: false,
    is_chauffeur: true,
    is_sltda_approved: true,
    profile_photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face',
    average_rating: 4.85,
    total_reviews: 167,
    completion_rate: 98,
    vehicle_type: 'suv',
    vehicle_make: 'Mitsubishi',
    vehicle_model: 'Montero Sport',
    vehicle_year: 2021,
    vehicle_features: ['Air Conditioning', '4x4', 'Safari Roof Hatch', 'Binoculars', 'Cooler Box'],
    service_areas: ['Yala', 'Udawalawe', 'Wilpattu', 'Hambantota', 'Tissamaharama'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const sampleReviews = [
  {
    driver_id: 'driver_001',
    reviewer_name: 'Michael Thompson',
    reviewer_country: 'United Kingdom',
    rating: 5,
    review_text: 'Chaminda was absolutely fantastic! His knowledge of Sri Lankan history and culture made our 10-day tour unforgettable. He went above and beyond to ensure we had the best experiences at every stop.',
    review_date: '2024-10-15',
    tour_type: 'Cultural Triangle Tour'
  },
  {
    driver_id: 'driver_001',
    reviewer_name: 'Sophie Müller',
    reviewer_country: 'Germany',
    rating: 5,
    review_text: 'Ausgezeichneter Service! Chaminda spricht fließend Deutsch und kennt jede Ecke Sri Lankas. Wärmste Empfehlung!',
    review_date: '2024-09-20',
    tour_type: 'Hill Country Tour'
  },
  {
    driver_id: 'driver_002',
    reviewer_name: 'Priya Sharma',
    reviewer_country: 'India',
    rating: 5,
    review_text: 'Suresh\'s knowledge of the ancient cities is incredible. He explained the history in such an engaging way that even our kids were fascinated!',
    review_date: '2024-08-10',
    tour_type: 'Ancient Cities Tour'
  },
  {
    driver_id: 'driver_003',
    reviewer_name: 'James Wilson',
    reviewer_country: 'Australia',
    rating: 4,
    review_text: 'Very reliable driver. Car was clean and comfortable. Nimal knows all the scenic routes and got us to each destination safely.',
    review_date: '2024-11-01',
    tour_type: 'South Coast Tour'
  },
  {
    driver_id: 'driver_004',
    reviewer_name: 'Yuki Tanaka',
    reviewer_country: 'Japan',
    rating: 5,
    review_text: '日本語が上手で、とても親切なガイドさんでした。スリランカの紅茶園ツアーは最高でした！',
    review_date: '2024-10-28',
    tour_type: 'Tea Plantation Tour'
  },
  {
    driver_id: 'driver_006',
    reviewer_name: 'Emma Roberts',
    reviewer_country: 'Canada',
    rating: 5,
    review_text: 'Arjuna knew exactly where to find the leopards! We saw 3 leopards in one safari. His jeep was comfortable and he had all the equipment we needed.',
    review_date: '2024-11-10',
    tour_type: 'Yala Safari'
  }
];

async function seedDrivers() {
  console.log('🚗 Seeding sample drivers...\n');
  
  const batch = db.batch();
  
  for (const driver of sampleDrivers) {
    const docRef = db.collection('drivers').doc(driver.id);
    batch.set(docRef, driver);
    console.log(`  ✅ Added driver: ${driver.full_name} (${driver.tier})`);
  }
  
  await batch.commit();
  console.log(`\n✅ Successfully added ${sampleDrivers.length} drivers\n`);
  
  console.log('📝 Seeding sample reviews...\n');
  
  const reviewBatch = db.batch();
  
  for (const review of sampleReviews) {
    const docRef = db.collection('driver_reviews').doc();
    reviewBatch.set(docRef, review);
    console.log(`  ✅ Added review for driver: ${review.driver_id}`);
  }
  
  await reviewBatch.commit();
  console.log(`\n✅ Successfully added ${sampleReviews.length} reviews\n`);
  
  console.log('🎉 Driver seeding complete!');
}

seedDrivers().catch(console.error);
