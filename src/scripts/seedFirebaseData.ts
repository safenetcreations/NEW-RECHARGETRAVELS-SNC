import { db } from '@/lib/firebase'
import { collection, addDoc, getDocs, deleteDoc, doc, setDoc } from 'firebase/firestore'

// Sample Drivers Data
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
    biography: 'With over 15 years of experience exploring every corner of Sri Lanka, I specialize in creating unforgettable journeys for travelers seeking authentic cultural experiences. As a certified Chauffeur Tourist Guide, I combine safe, comfortable driving with deep knowledge of Sri Lankan history, wildlife, and hidden gems. Fluent in English, German, and French.',
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
    service_areas: ['Colombo', 'Kandy', 'Galle', 'Ella', 'Sigiriya', 'Yala']
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
    biography: 'As a National Tourist Guide Lecturer, I specialize in leading groups through Sri Lanka\'s UNESCO World Heritage Sites. My expertise lies in ancient history, archaeology, and Buddhist heritage. I\'ve guided over 500 tour groups.',
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
    service_areas: ['Anuradhapura', 'Polonnaruwa', 'Sigiriya', 'Dambulla', 'Kandy']
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
    biography: 'SLITHM-trained professional tourist driver with 12 years of experience navigating Sri Lanka\'s diverse terrains. I specialize in hill country tours and wildlife safaris. Safety and comfort are my top priorities.',
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
    service_areas: ['Colombo', 'Negombo', 'Kandy', 'Nuwara Eliya', 'Ella']
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
    biography: 'As one of the few female chauffeur guides in Sri Lanka, I bring a unique perspective to tourism. I specialize in wellness tours, tea plantation visits, and cultural immersion experiences. Fluent in Japanese and Mandarin.',
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
    service_areas: ['Colombo', 'Nuwara Eliya', 'Kandy', 'Galle', 'Bentota']
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
    service_areas: ['Colombo', 'Negombo', 'Airport']
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
    biography: 'Safari specialist with extensive experience in Yala, Udawalawe, and Wilpattu national parks. My comfortable safari jeep and knowledge of wildlife behavior ensure the best wildlife sighting experiences.',
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
    service_areas: ['Yala', 'Udawalawe', 'Wilpattu', 'Hambantota', 'Tissamaharama']
  }
];

const sampleDriverReviews = [
  {
    driver_id: 'driver_001',
    reviewer_name: 'Michael Thompson',
    reviewer_country: 'United Kingdom',
    rating: 5,
    review_text: 'Chaminda was absolutely fantastic! His knowledge of Sri Lankan history and culture made our 10-day tour unforgettable.',
    review_date: '2024-10-15',
    tour_type: 'Cultural Triangle Tour'
  },
  {
    driver_id: 'driver_001',
    reviewer_name: 'Sophie Müller',
    reviewer_country: 'Germany',
    rating: 5,
    review_text: 'Ausgezeichneter Service! Chaminda spricht fließend Deutsch und kennt jede Ecke Sri Lankas.',
    review_date: '2024-09-20',
    tour_type: 'Hill Country Tour'
  },
  {
    driver_id: 'driver_002',
    reviewer_name: 'Priya Sharma',
    reviewer_country: 'India',
    rating: 5,
    review_text: 'Suresh\'s knowledge of the ancient cities is incredible. He explained the history in such an engaging way!',
    review_date: '2024-08-10',
    tour_type: 'Ancient Cities Tour'
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
    review_text: 'Arjuna knew exactly where to find the leopards! We saw 3 leopards in one safari. Highly recommended!',
    review_date: '2024-11-10',
    tour_type: 'Yala Safari'
  }
];

const sampleTours = [
  {
    title: "Sigiriya & Dambulla Day Tour",
    description: "Explore the ancient rock fortress of Sigiriya and the golden temple of Dambulla on this unforgettable day tour. Climb the iconic Lion Rock and discover ancient frescoes and ruins.",
    duration_days: 1,
    price_per_person: 85,
    category: "cultural",
    destination: "Sigiriya",
    difficulty_level: "moderate",
    max_group_size: 15,
    included_items: [
      "Professional English-speaking guide",
      "Air-conditioned vehicle",
      "Entrance fees to all sites",
      "Lunch at local restaurant",
      "Bottled water"
    ],
    excluded_items: [
      "Personal expenses",
      "Tips and gratuities",
      "Travel insurance"
    ],
    itinerary: [
      {
        day: 1,
        title: "Sigiriya & Dambulla Adventure",
        activities: [
          "6:00 AM - Pick up from hotel",
          "9:00 AM - Arrive at Sigiriya Rock Fortress",
          "12:00 PM - Lunch break",
          "2:00 PM - Visit Dambulla Cave Temple",
          "5:00 PM - Return to hotel"
        ]
      }
    ],
    images: [
      "https://images.unsplash.com/photo-1584981358663-ad30f30dc4a2?w=800&h=600&fit=crop"
    ],
    rating: 4.8,
    is_active: true
  },
  {
    title: "Yala National Park Safari",
    description: "Experience the thrill of spotting leopards, elephants, and exotic birds in Sri Lanka's most famous national park. Our experienced guides will ensure you have the best wildlife viewing opportunities.",
    duration_days: 1,
    price_per_person: 120,
    category: "wildlife",
    destination: "Yala",
    difficulty_level: "easy",
    max_group_size: 6,
    included_items: [
      "4x4 Safari jeep",
      "Professional wildlife guide",
      "Park entrance fees",
      "Breakfast and lunch",
      "Binoculars"
    ],
    excluded_items: [
      "Accommodation",
      "Alcoholic beverages",
      "Personal expenses"
    ],
    itinerary: [
      {
        day: 1,
        title: "Full Day Safari Adventure",
        activities: [
          "5:00 AM - Early morning pick up",
          "6:00 AM - Enter Yala National Park",
          "8:00 AM - Breakfast in the park",
          "12:00 PM - Lunch break",
          "3:00 PM - Exit park and return"
        ]
      }
    ],
    images: [
      "https://images.unsplash.com/photo-1561971978-17f98e1a17a9?w=800&h=600&fit=crop"
    ],
    rating: 4.9,
    is_active: true
  },
  {
    title: "Galle & South Coast Tour",
    description: "Discover the colonial charm of Galle Fort, relax on pristine beaches, and visit a turtle hatchery on this coastal adventure.",
    duration_days: 1,
    price_per_person: 75,
    category: "beach",
    destination: "Galle",
    difficulty_level: "easy",
    max_group_size: 20,
    included_items: [
      "Transportation in AC vehicle",
      "English-speaking guide",
      "Galle Fort walking tour",
      "Turtle hatchery visit",
      "Traditional lunch"
    ],
    excluded_items: [
      "Beach activities",
      "Shopping expenses",
      "Additional meals"
    ],
    itinerary: [
      {
        day: 1,
        title: "Coastal Heritage Tour",
        activities: [
          "7:00 AM - Hotel pick up",
          "9:30 AM - Explore Galle Fort",
          "12:00 PM - Lunch at beach restaurant",
          "2:00 PM - Visit turtle hatchery",
          "4:00 PM - Beach time",
          "6:00 PM - Return journey"
        ]
      }
    ],
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc3e?w=800&h=600&fit=crop"
    ],
    rating: 4.7,
    is_active: true
  }
]

const sampleHotels = [
  {
    name: "Cinnamon Grand Colombo",
    description: "A luxury 5-star hotel in the heart of Colombo, offering world-class amenities and exceptional service.",
    star_rating: 5,
    hotel_type: "luxury",
    base_price_per_night: 180,
    country: "Sri Lanka",
    latitude: 6.9271,
    longitude: 79.8437,
    address: "77 Galle Road, Colombo 00300",
    phone: "+94 11 243 7437",
    amenities: ["Swimming Pool", "Spa", "Fitness Center", "Restaurant", "Bar", "WiFi", "Parking"],
    is_active: true,
    city: {
      name: "Colombo",
      country: "Sri Lanka"
    }
  },
  {
    name: "Jetwing Yala",
    description: "An eco-luxury resort situated at the doorstep of Yala National Park, perfect for wildlife enthusiasts.",
    star_rating: 5,
    hotel_type: "resort",
    base_price_per_night: 220,
    country: "Sri Lanka",
    latitude: 6.3654,
    longitude: 81.4818,
    address: "Yala, Kirinda",
    phone: "+94 47 739 0400",
    amenities: ["Pool", "Wildlife Tours", "Spa", "Restaurant", "Bar", "WiFi", "Nature Walks"],
    is_active: true,
    city: {
      name: "Yala",
      country: "Sri Lanka"
    }
  },
  {
    name: "98 Acres Resort & Spa",
    description: "A stunning hillside resort in Ella offering breathtaking views of the surrounding mountains and tea plantations.",
    star_rating: 4,
    hotel_type: "resort",
    base_price_per_night: 150,
    country: "Sri Lanka",
    latitude: 6.8667,
    longitude: 81.0467,
    address: "Greenland Estate, Ella",
    phone: "+94 57 205 0050",
    amenities: ["Infinity Pool", "Spa", "Restaurant", "Trekking", "Tea Tours", "WiFi"],
    is_active: true,
    city: {
      name: "Ella",
      country: "Sri Lanka"
    }
  }
]

export const seedFirebaseData = async () => {
  try {
    console.log('Starting to seed Firebase data...')
    
    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('Clearing existing data...')
    const toursSnapshot = await getDocs(collection(db, 'tours'))
    const hotelsSnapshot = await getDocs(collection(db, 'hotels'))
    const driversSnapshot = await getDocs(collection(db, 'drivers'))
    const driverReviewsSnapshot = await getDocs(collection(db, 'driver_reviews'))
    
    const deletePromises = [
      ...toursSnapshot.docs.map(doc => deleteDoc(doc.ref)),
      ...hotelsSnapshot.docs.map(doc => deleteDoc(doc.ref)),
      ...driversSnapshot.docs.map(doc => deleteDoc(doc.ref)),
      ...driverReviewsSnapshot.docs.map(doc => deleteDoc(doc.ref))
    ]
    
    await Promise.all(deletePromises)
    
    // Add sample tours
    console.log('Adding sample tours...')
    for (const tour of sampleTours) {
      await addDoc(collection(db, 'tours'), {
        ...tour,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    }
    
    // Add sample hotels
    console.log('Adding sample hotels...')
    for (const hotel of sampleHotels) {
      await addDoc(collection(db, 'hotels'), {
        ...hotel,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    }

    // Add sample drivers
    console.log('Adding sample drivers...')
    for (const driver of sampleDrivers) {
      await setDoc(doc(db, 'drivers', driver.id), {
        ...driver,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    }

    // Add sample driver reviews
    console.log('Adding sample driver reviews...')
    for (const review of sampleDriverReviews) {
      await addDoc(collection(db, 'driver_reviews'), {
        ...review,
        created_at: new Date().toISOString()
      })
    }
    
    console.log('✅ Firebase data seeded successfully!')
    return { success: true }
  } catch (error) {
    console.error('Error seeding Firebase data:', error)
    return { success: false, error }
  }
}

// Export individual seeding functions for granular control
export const seedDriversOnly = async () => {
  try {
    console.log('Seeding drivers data...')
    
    // Clear existing drivers
    const driversSnapshot = await getDocs(collection(db, 'drivers'))
    const driverReviewsSnapshot = await getDocs(collection(db, 'driver_reviews'))
    
    await Promise.all([
      ...driversSnapshot.docs.map(doc => deleteDoc(doc.ref)),
      ...driverReviewsSnapshot.docs.map(doc => deleteDoc(doc.ref))
    ])

    // Add drivers
    for (const driver of sampleDrivers) {
      await setDoc(doc(db, 'drivers', driver.id), {
        ...driver,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    }

    // Add reviews
    for (const review of sampleDriverReviews) {
      await addDoc(collection(db, 'driver_reviews'), {
        ...review,
        created_at: new Date().toISOString()
      })
    }

    console.log('✅ Drivers seeded successfully!')
    return { success: true, driversAdded: sampleDrivers.length }
  } catch (error) {
    console.error('Error seeding drivers:', error)
    return { success: false, error }
  }
}