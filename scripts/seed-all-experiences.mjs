// Seed All Experience Content to Firebase using Admin SDK
// Run with: GOOGLE_APPLICATION_CREDENTIALS=path/to/key.json node scripts/seed-all-experiences.mjs
// Or just: node scripts/seed-all-experiences.mjs (if using gcloud auth application-default login)

import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

// Initialize Firebase Admin
initializeApp({
  credential: applicationDefault(),
  projectId: process.env.FIREBASE_PROJECT_ID || 'recharge-travels-73e76'
});

const db = getFirestore();

// ============================================
// WHALE WATCHING CONTENT
// ============================================
const WHALE_WATCHING_CONTENT = {
  hero: {
    title: 'Whale Watching Concierge Booking',
    subtitle: 'Licensed sunrise departures in Mirissa & Trincomalee with marine biologist hosts.',
    badge: 'World Cetacean Alliance aligned',
    backgroundImage: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?auto=format&fit=crop&w=2000&q=80',
    images: [
      { id: '1', url: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a', caption: 'Blue Whale in Sri Lankan Waters' },
      { id: '2', url: 'https://images.unsplash.com/photo-1511259474226-3c0a03c2b1a8', caption: 'Whale Tail Breaching' },
      { id: '3', url: 'https://images.unsplash.com/photo-1568430462989-44163eb1752f', caption: 'Dolphins Swimming' },
      { id: '4', url: 'https://images.unsplash.com/photo-1454372182658-c712e4c5a1db', caption: 'Whale Watching Boat Tour' }
    ]
  },
  seasons: [
    {
      id: 'mirissa',
      title: 'Mirissa Season',
      months: 'November - April',
      description: 'Southern coast season with calm seas and excellent blue whale sightings',
      successStat: '98% sighting success rate',
      pickupPoint: 'Mirissa Harbor',
      departure: '6:00 AM',
      highlights: ['Blue Whales', 'Spinner Dolphins', 'Sperm Whales', 'Sea Turtles']
    },
    {
      id: 'trincomalee',
      title: 'Trincomalee Season',
      months: 'May - October',
      description: 'East coast season with deeper waters and diverse marine life',
      successStat: '95% sighting success rate',
      pickupPoint: 'Trincomalee Harbor',
      departure: '6:30 AM',
      highlights: ['Blue Whales', 'Orcas', 'Pilot Whales', 'Dolphins']
    }
  ],
  tours: [
    {
      id: 'premium-mirissa',
      name: 'Premium Mirissa Whale Watch',
      duration: '4-5 hours',
      price: 125,
      priceLabel: 'USD 125 per person',
      description: 'Exclusive small group whale watching experience with marine biologist guide',
      maxGuests: 12,
      rating: 4.9,
      includes: ['Hotel pickup', 'Light breakfast', 'Marine biologist guide', 'Whale spotting guarantee'],
      image: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=800'
    },
    {
      id: 'standard-mirissa',
      name: 'Standard Mirissa Tour',
      duration: '4 hours',
      price: 65,
      priceLabel: 'USD 65 per person',
      description: 'Group whale watching experience with experienced captain',
      maxGuests: 24,
      rating: 4.7,
      includes: ['Boat ride', 'Life jacket', 'Refreshments'],
      image: 'https://images.unsplash.com/photo-1511259474226-3c0a03c2b1a8?w=800'
    }
  ],
  overview: {
    summary: 'Experience the thrill of encountering the world\'s largest mammals in the pristine waters of Sri Lanka.',
    badges: ['Eco-Certified', 'Small Groups', 'Expert Guides'],
    highlights: ['98% Success Rate', 'Marine Biologist Hosts', 'Sustainable Tourism']
  },
  pricing: {
    currency: 'USD',
    adultPrice: 65,
    childPrice: 45,
    depositNote: '20% deposit required at booking',
    disclaimer: 'Prices may vary by season',
    lowestPriceGuarantee: 'Best price guaranteed',
    refundPolicy: 'Full refund if cancelled 48 hours before'
  }
};

// ============================================
// TEA TRAILS CONTENT
// ============================================
const TEA_TRAILS_CONTENT = {
  hero: {
    title: 'Ceylon Tea Trails Experience',
    subtitle: 'Journey through emerald estates in the heart of Sri Lanka\'s hill country',
    badge: 'Heritage Certified',
    backgroundImage: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=2000&q=80',
    images: [
      { id: '1', url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574', caption: 'Lush Tea Plantations' },
      { id: '2', url: 'https://images.unsplash.com/photo-1582639510494-c80b5de9f148', caption: 'Tea Plucking Experience' },
      { id: '3', url: 'https://images.unsplash.com/photo-1523920290228-4f321a939b4c', caption: 'Colonial Tea Factory' }
    ]
  },
  estates: [
    {
      id: 'castlereagh',
      name: 'Castlereagh Estate',
      location: 'Hatton',
      elevation: '1,250m',
      description: 'Historic estate overlooking Castlereagh Reservoir',
      highlights: ['Lake Views', 'Heritage Bungalow', 'High-grown Tea'],
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800'
    },
    {
      id: 'norwood',
      name: 'Norwood Estate',
      location: 'Nuwara Eliya',
      elevation: '1,800m',
      description: 'Premium high-altitude tea estate',
      highlights: ['Misty Mountains', 'Best Ceylon Tea', 'Tea Tasting'],
      image: 'https://images.unsplash.com/photo-1582639510494-c80b5de9f148?w=800'
    }
  ],
  tours: [
    {
      id: 'full-day-tea',
      name: 'Full Day Tea Trail',
      duration: '8 hours',
      price: 120,
      description: 'Complete tea experience from plantation to cup',
      includes: ['Estate visit', 'Factory tour', 'Tea plucking', 'Lunch', 'Tea tasting']
    },
    {
      id: 'half-day-tea',
      name: 'Half Day Tea Experience',
      duration: '4 hours',
      price: 65,
      description: 'Quick immersion into Ceylon tea culture',
      includes: ['Factory tour', 'Tea tasting', 'Gift pack']
    }
  ],
  pricing: {
    currency: 'USD',
    basePrice: 65,
    groupDiscount: '10% off for groups of 4+'
  }
};

// ============================================
// AYURVEDA WELLNESS CONTENT
// ============================================
const AYURVEDA_CONTENT = {
  hero: {
    title: 'Authentic Ayurveda Wellness',
    subtitle: 'Ancient healing traditions in certified wellness centers',
    badge: 'Government Certified',
    backgroundImage: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=2000&q=80',
    images: [
      { id: '1', url: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597', caption: 'Ayurvedic Spa Treatment' },
      { id: '2', url: 'https://images.unsplash.com/photo-1540555700478-4be289fbec6d', caption: 'Herbal Garden' },
      { id: '3', url: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1', caption: 'Meditation Session' }
    ]
  },
  treatments: [
    {
      id: 'panchakarma',
      name: 'Panchakarma Detox',
      duration: '7-21 days',
      description: 'Complete body purification and rejuvenation program',
      benefits: ['Detoxification', 'Weight Management', 'Stress Relief', 'Immune Boost'],
      price: 'From $1,500'
    },
    {
      id: 'rejuvenation',
      name: 'Rejuvenation Package',
      duration: '3-7 days',
      description: 'Revitalize mind and body with traditional therapies',
      benefits: ['Anti-aging', 'Energy Boost', 'Better Sleep', 'Mental Clarity'],
      price: 'From $500'
    },
    {
      id: 'stress-relief',
      name: 'Stress Relief Program',
      duration: '5-14 days',
      description: 'Specialized treatment for stress and anxiety',
      benefits: ['Relaxation', 'Mental Peace', 'Better Focus', 'Emotional Balance'],
      price: 'From $800'
    }
  ],
  centers: [
    {
      id: 'siddhalepa',
      name: 'Siddhalepa Ayurveda Resort',
      location: 'Wadduwa',
      rating: 4.9,
      description: 'World-renowned ayurveda hospital and resort'
    },
    {
      id: 'barberyn',
      name: 'Barberyn Beach Ayurveda',
      location: 'Weligama',
      rating: 4.8,
      description: 'Beachside wellness retreat'
    }
  ]
};

// ============================================
// PILGRIMAGE TOURS CONTENT
// ============================================
const PILGRIMAGE_CONTENT = {
  hero: {
    title: 'Sacred Pilgrimage Tours',
    subtitle: 'Journey to Sri Lanka\'s most revered spiritual sites',
    badge: 'Spiritual Heritage',
    backgroundImage: 'https://images.unsplash.com/photo-1580181046391-e7e83f206c62?auto=format&fit=crop&w=2000&q=80',
    images: [
      { id: '1', url: 'https://images.unsplash.com/photo-1580181046391-e7e83f206c62', caption: 'Temple of the Tooth' },
      { id: '2', url: 'https://images.unsplash.com/photo-1588598198321-39f8c2be97ba', caption: 'Anuradhapura Stupas' },
      { id: '3', url: 'https://images.unsplash.com/photo-1586523969943-2d62a1a7d4d3', caption: 'Adam\'s Peak Sunrise' }
    ]
  },
  tours: [
    {
      id: 'cultural-triangle',
      name: 'Cultural Triangle Pilgrimage',
      duration: '5 days',
      price: 650,
      sites: ['Anuradhapura', 'Polonnaruwa', 'Dambulla', 'Kandy'],
      description: 'Visit the sacred cities of the Cultural Triangle',
      includes: ['Accommodation', 'Guide', 'Transport', 'Temple offerings']
    },
    {
      id: 'adams-peak',
      name: 'Adam\'s Peak Pilgrimage',
      duration: '2 days',
      price: 180,
      sites: ['Sri Pada (Adam\'s Peak)'],
      description: 'Sacred mountain climb with sunrise viewing',
      includes: ['Transport', 'Guide', 'Accommodation', 'Meals']
    },
    {
      id: 'ramayana-trail',
      name: 'Ramayana Trail',
      duration: '7 days',
      price: 850,
      sites: ['Munneswaram', 'Sita Amman', 'Ravana Falls', 'Nuwara Eliya'],
      description: 'Follow the legendary Ramayana trail across Sri Lanka',
      includes: ['All accommodation', 'Expert guide', 'Transport', 'Meals']
    }
  ],
  sacredSites: [
    { id: 'kandy', name: 'Temple of the Tooth', religion: 'Buddhist', location: 'Kandy' },
    { id: 'anuradhapura', name: 'Sri Maha Bodhi', religion: 'Buddhist', location: 'Anuradhapura' },
    { id: 'kataragama', name: 'Kataragama Temple', religion: 'Multi-faith', location: 'Kataragama' },
    { id: 'nagadeepa', name: 'Nagadeepa Purana Viharaya', religion: 'Buddhist', location: 'Jaffna' }
  ]
};

// ============================================
// COOKING CLASS CONTENT
// ============================================
const COOKING_CLASS_CONTENT = {
  hero: {
    title: 'Sri Lankan Cooking Classes',
    subtitle: 'Master authentic Ceylon cuisine with expert chefs',
    badge: 'Culinary Experience',
    backgroundImage: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=2000&q=80',
    images: [
      { id: '1', url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d', caption: 'Traditional Cooking' },
      { id: '2', url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe', caption: 'Spice Market Tour' },
      { id: '3', url: 'https://images.unsplash.com/photo-1544025162-d76694265947', caption: 'Enjoy Your Creation' }
    ]
  },
  classes: [
    {
      id: 'traditional-rice-curry',
      name: 'Traditional Rice & Curry',
      duration: '4 hours',
      price: 45,
      dishes: ['Coconut Rice', 'Chicken Curry', 'Dhal', 'Pol Sambol', 'Papadam'],
      includes: ['Market visit', 'All ingredients', 'Recipe book', 'Lunch']
    },
    {
      id: 'seafood-special',
      name: 'Coastal Seafood Special',
      duration: '5 hours',
      price: 65,
      dishes: ['Fish Ambul Thiyal', 'Prawn Curry', 'Crab Curry', 'Coconut Roti'],
      includes: ['Fish market tour', 'All ingredients', 'Recipe book', 'Lunch']
    },
    {
      id: 'street-food',
      name: 'Sri Lankan Street Food',
      duration: '3 hours',
      price: 35,
      dishes: ['Kottu Roti', 'Hoppers', 'String Hoppers', 'Samosas'],
      includes: ['All ingredients', 'Recipe book', 'Tasting session']
    }
  ],
  locations: [
    { id: 'colombo', name: 'Colombo Cooking Studio', address: 'Colombo 07' },
    { id: 'galle', name: 'Galle Fort Kitchen', address: 'Galle Fort' },
    { id: 'kandy', name: 'Hill Country Kitchen', address: 'Kandy' }
  ]
};

// ============================================
// WATERFALLS CONTENT
// ============================================
const WATERFALLS_CONTENT = {
  hero: {
    title: 'Spectacular Sri Lankan Waterfalls',
    subtitle: 'Discover cascading wonders in the hill country',
    badge: 'Natural Heritage',
    backgroundImage: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=2000&q=80',
    images: [
      { id: '1', url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9', caption: 'Bambarakanda Falls' },
      { id: '2', url: 'https://images.unsplash.com/photo-1546587348-d12660c30c50', caption: 'Diyaluma Falls' },
      { id: '3', url: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb', caption: 'Ravana Falls' }
    ]
  },
  waterfalls: [
    {
      id: 'bambarakanda',
      name: 'Bambarakanda Falls',
      height: '263m',
      rank: 'Tallest in Sri Lanka',
      location: 'Kalupahana, Badulla',
      description: 'Sri Lanka\'s tallest waterfall cascading majestically',
      difficulty: 'Moderate',
      duration: '2-3 hours',
      bestTime: 'January - April'
    },
    {
      id: 'diyaluma',
      name: 'Diyaluma Falls',
      height: '220m',
      rank: '2nd Highest',
      location: 'Koslanda',
      description: 'Features stunning natural infinity pools',
      difficulty: 'Moderate to Hard',
      duration: '3-4 hours',
      bestTime: 'Year-round'
    },
    {
      id: 'ravana',
      name: 'Ravana Falls',
      height: '25m',
      rank: 'Most Accessible',
      location: 'Ella',
      description: 'Associated with the Ramayana legend',
      difficulty: 'Easy',
      duration: '1-2 hours',
      bestTime: 'Year-round'
    }
  ],
  tours: [
    {
      id: 'waterfall-circuit',
      name: 'Waterfall Circuit Tour',
      duration: 'Full Day',
      price: 85,
      description: 'Visit 3 major waterfalls in one day',
      includes: ['Transport', 'Guide', 'Lunch', 'Entrance fees']
    }
  ]
};

// ============================================
// LAGOON SAFARI CONTENT
// ============================================
const LAGOON_SAFARI_CONTENT = {
  hero: {
    title: 'Lagoon Safari Adventures',
    subtitle: 'Explore pristine lagoons and mangrove ecosystems',
    badge: 'Eco-Tourism',
    backgroundImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=2000&q=80',
    images: [
      { id: '1', url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5', caption: 'Lagoon Waters' },
      { id: '2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d', caption: 'Mangrove Forest' }
    ]
  },
  lagoons: [
    {
      id: 'negombo',
      name: 'Negombo Lagoon',
      location: 'Negombo',
      description: 'Rich biodiversity and fishing communities',
      highlights: ['Bird Watching', 'Fishing Villages', 'Mangroves']
    },
    {
      id: 'koggala',
      name: 'Koggala Lagoon',
      location: 'Koggala',
      description: 'Scenic lagoon with cinnamon islands',
      highlights: ['Cinnamon Islands', 'Temple Island', 'Bird Sanctuary']
    },
    {
      id: 'batticaloa',
      name: 'Batticaloa Lagoon',
      location: 'Batticaloa',
      description: 'Famous singing fish phenomenon',
      highlights: ['Singing Fish', 'Sunset Tours', 'Local Culture']
    }
  ],
  tours: [
    {
      id: 'sunrise-safari',
      name: 'Sunrise Lagoon Safari',
      duration: '3 hours',
      price: 45,
      includes: ['Boat ride', 'Bird watching', 'Breakfast', 'Guide']
    },
    {
      id: 'sunset-cruise',
      name: 'Sunset Lagoon Cruise',
      duration: '2 hours',
      price: 35,
      includes: ['Boat ride', 'Refreshments', 'Photography stops']
    }
  ]
};

// ============================================
// ISLAND GETAWAYS CONTENT
// ============================================
const ISLAND_GETAWAYS_CONTENT = {
  hero: {
    title: 'Sri Lankan Island Escapes',
    subtitle: 'Discover hidden paradise islands off the coast',
    badge: 'Island Paradise',
    backgroundImage: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?auto=format&fit=crop&w=2000&q=80',
    images: [
      { id: '1', url: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5', caption: 'Pigeon Island' },
      { id: '2', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', caption: 'Delft Island' }
    ]
  },
  islands: [
    {
      id: 'pigeon',
      name: 'Pigeon Island',
      location: 'Trincomalee',
      description: 'National park with pristine coral reefs',
      activities: ['Snorkeling', 'Diving', 'Beach', 'Wildlife'],
      bestTime: 'May - October'
    },
    {
      id: 'delft',
      name: 'Delft Island',
      location: 'Jaffna',
      description: 'Wild horses and Dutch colonial ruins',
      activities: ['History', 'Wild Horses', 'Ancient Ruins', 'Culture'],
      bestTime: 'Year-round'
    },
    {
      id: 'taprobane',
      name: 'Taprobane Island',
      location: 'Weligama',
      description: 'Private island with luxury villa',
      activities: ['Luxury Stay', 'Privacy', 'Beach', 'Relaxation'],
      bestTime: 'November - April'
    }
  ],
  tours: [
    {
      id: 'pigeon-day-trip',
      name: 'Pigeon Island Day Trip',
      duration: 'Full Day',
      price: 75,
      includes: ['Boat transfer', 'Snorkeling gear', 'Lunch', 'Guide']
    },
    {
      id: 'delft-expedition',
      name: 'Delft Island Expedition',
      duration: 'Full Day',
      price: 65,
      includes: ['Ferry tickets', 'Guide', 'Lunch', 'Island tour']
    }
  ]
};

// ============================================
// TRAIN JOURNEYS CONTENT
// ============================================
const TRAIN_JOURNEYS_CONTENT = {
  hero: {
    title: 'Scenic Train Journeys',
    subtitle: 'Experience the world\'s most beautiful train rides',
    badge: 'Heritage Railway',
    backgroundImage: 'https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?auto=format&fit=crop&w=2000&q=80',
    images: [
      { id: '1', url: 'https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9', caption: 'Nine Arch Bridge' },
      { id: '2', url: 'https://images.unsplash.com/photo-1540202403-b7abd6747a18', caption: 'Tea Country Views' }
    ]
  },
  routes: [
    {
      id: 'ella-kandy',
      name: 'Kandy to Ella',
      duration: '6-7 hours',
      distance: '140 km',
      highlights: ['Nine Arch Bridge', 'Tea Plantations', 'Waterfalls', 'Mountains'],
      bestClass: 'First Class Observation',
      price: { firstClass: 15, secondClass: 8, thirdClass: 3 }
    },
    {
      id: 'colombo-kandy',
      name: 'Colombo to Kandy',
      duration: '2.5-3 hours',
      distance: '116 km',
      highlights: ['Coconut Plantations', 'Rice Paddies', 'Hill Views'],
      bestClass: 'First Class',
      price: { firstClass: 8, secondClass: 4, thirdClass: 2 }
    },
    {
      id: 'coastal',
      name: 'Colombo to Galle',
      duration: '2.5 hours',
      distance: '120 km',
      highlights: ['Ocean Views', 'Beaches', 'Fishing Villages'],
      bestClass: 'Second Class',
      price: { firstClass: 6, secondClass: 3, thirdClass: 1.5 }
    }
  ],
  tips: [
    'Book first class seats in advance',
    'Sit on the right side for best views (Kandy to Ella)',
    'Bring snacks and water',
    'Keep valuables secure'
  ]
};

// ============================================
// SEED FUNCTIONS
// ============================================

async function seedCollection(collectionName, docId, data) {
  console.log(`Seeding ${collectionName}/${docId}...`);
  const ref = db.collection(collectionName).doc(docId);
  await ref.set({
    ...data,
    updatedAt: FieldValue.serverTimestamp(),
    createdAt: FieldValue.serverTimestamp()
  });
  console.log(`✅ Seeded ${collectionName}/${docId}`);
}

async function seedAllExperiences() {
  console.log('\n🌟 Starting to seed all experience content...\n');

  try {
    // Whale Watching
    await seedCollection('whaleWatchingPageContent', 'public', WHALE_WATCHING_CONTENT);

    // Tea Trails
    await seedCollection('teaTrailsContent', 'public', TEA_TRAILS_CONTENT);

    // Ayurveda Wellness
    await seedCollection('ayurvedaContent', 'public', AYURVEDA_CONTENT);

    // Pilgrimage Tours
    await seedCollection('pilgrimageContent', 'public', PILGRIMAGE_CONTENT);

    // Cooking Classes
    await seedCollection('cookingClassContent', 'public', COOKING_CLASS_CONTENT);

    // Waterfalls
    await seedCollection('waterfallsContent', 'public', WATERFALLS_CONTENT);

    // Lagoon Safari
    await seedCollection('lagoonSafariContent', 'public', LAGOON_SAFARI_CONTENT);

    // Island Getaways
    await seedCollection('islandGetawaysContent', 'public', ISLAND_GETAWAYS_CONTENT);

    // Train Journeys
    await seedCollection('trainJourneysContent', 'public', TRAIN_JOURNEYS_CONTENT);

    console.log('\n✅ Successfully seeded all experience content!');
    console.log('\n📋 Collections seeded:');
    console.log('  - whaleWatchingPageContent');
    console.log('  - teaTrailsContent');
    console.log('  - ayurvedaContent');
    console.log('  - pilgrimageContent');
    console.log('  - cookingClassContent');
    console.log('  - waterfallsContent');
    console.log('  - lagoonSafariContent');
    console.log('  - islandGetawaysContent');
    console.log('  - trainJourneysContent');
    console.log('\nYou can now see this content in the admin panel or update via Firebase Console.');

  } catch (error) {
    console.error('❌ Error seeding experiences:', error);
  }

  process.exit(0);
}

// Run the seed
seedAllExperiences();
