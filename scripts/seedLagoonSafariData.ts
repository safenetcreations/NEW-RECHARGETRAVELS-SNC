import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, addDoc } from 'firebase/firestore';
import lagoonSafariData from '../src/data/seed-lagoon-safari.json';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample tours data for lagoon safari
const sampleTours = [
  {
    experienceSlug: 'lagoon-safari',
    title: 'Madu Ganga Full Day Safari',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Flagoon-madu-full-day.webp?alt=media',
    badges: ['Most Popular', 'Lunch Included'],
    duration: '6 hours',
    salePriceUSD: 65,
    regularPriceUSD: 80,
    isPublished: true,
    description: 'Comprehensive lagoon exploration including mangrove tunnels, cinnamon island, temple visit, and fish spa.',
    highlights: [
      'Visit 5 different islands',
      'Traditional Sri Lankan lunch on island',
      'Cinnamon peeling demonstration',
      'Buddhist temple on island',
      'Natural fish spa experience'
    ]
  },
  {
    experienceSlug: 'lagoon-safari',
    title: 'Negombo Sunset Lagoon Cruise',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Flagoon-negombo-sunset.webp?alt=media',
    badges: ['Romantic', 'Photography'],
    duration: '2.5 hours',
    salePriceUSD: 35,
    regularPriceUSD: 45,
    isPublished: true,
    description: 'Peaceful evening cruise through Negombo lagoon with stunning sunset views and bird watching.',
    highlights: [
      'Golden hour photography',
      'Complimentary refreshments',
      'Stilt fishermen sightings',
      'Mangrove bird colonies',
      'Traditional fishing village views'
    ]
  },
  {
    experienceSlug: 'lagoon-safari',
    title: 'Kalpitiya Mangrove Kayaking Adventure',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Flagoon-kalpitiya-kayak.webp?alt=media',
    badges: ['Active', 'Eco-Tour'],
    duration: '3 hours',
    salePriceUSD: 45,
    regularPriceUSD: 55,
    isPublished: true,
    description: 'Paddle through pristine mangrove forests in stable kayaks with expert naturalist guides.',
    highlights: [
      'Quality kayaking equipment',
      'Small group (max 6 people)',
      'Mangrove ecology education',
      'Water monitor and bird spotting',
      'Refreshments on secluded beach'
    ]
  },
  {
    experienceSlug: 'lagoon-safari',
    title: 'Bentota River Safari & Baby Turtles',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Flagoon-bentota-turtles.webp?alt=media',
    badges: ['Family-Friendly', 'Wildlife'],
    duration: '4 hours',
    salePriceUSD: 55,
    regularPriceUSD: 70,
    isPublished: true,
    description: 'Combine river safari with visit to turtle hatchery - perfect for families with children.',
    highlights: [
      'Baby turtle release experience',
      'Crocodile spotting opportunities',
      'Visit turtle conservation center',
      'Mangrove tunnel exploration',
      'Educational for children'
    ]
  },
  {
    experienceSlug: 'lagoon-safari',
    title: 'Private Luxury Lagoon Experience',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Flagoon-luxury-private.webp?alt=media',
    badges: ['Private', 'Luxury'],
    duration: '5 hours',
    salePriceUSD: 145,
    regularPriceUSD: 180,
    isPublished: true,
    description: 'Exclusive private boat with gourmet picnic, premium service, and customized itinerary.',
    highlights: [
      'Private luxury boat charter',
      'Gourmet picnic lunch',
      'Champagne and premium beverages',
      'Flexible itinerary',
      'Professional naturalist guide'
    ]
  },
  {
    experienceSlug: 'lagoon-safari',
    title: 'Muthurajawela Wetland Bird Paradise',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Flagoon-muthurajawela-birds.webp?alt=media',
    badges: ['Birding', 'Dawn Departure'],
    duration: '4 hours',
    salePriceUSD: 50,
    regularPriceUSD: 60,
    isPublished: true,
    description: 'Early morning bird watching cruise through Sri Lanka\'s largest saline coastal peat bog.',
    highlights: [
      'Over 190 bird species possible',
      'Dawn departure for best sightings',
      'Expert ornithologist guide',
      'Binoculars provided',
      'Light breakfast included'
    ]
  }
];

// Sample FAQs for lagoon safari
const sampleFAQs = [
  {
    tag: 'lagoon-safari',
    question: 'What is the best time for a lagoon safari in Sri Lanka?',
    answer: 'Lagoon safaris can be enjoyed year-round, but the best conditions are from November to April when rainfall is minimal. Early morning (6-9 AM) offers the best wildlife activity and bird watching, while late afternoon (3-6 PM) provides beautiful lighting and sunset views. Avoid midday when animals are less active and sun is strongest.',
    order: 1
  },
  {
    tag: 'lagoon-safari',
    question: 'What wildlife can I expect to see on a lagoon safari?',
    answer: 'Sri Lankan lagoons host diverse wildlife including water monitors (large lizards), mugger crocodiles (in some areas), various kingfisher species, brahminy kites, sea eagles, cormorants, herons, and egrets. In mangroves, you\'ll see mudskippers, fiddler crabs, and numerous fish species. Monkeys are common on lagoon islands, and you might spot fruit bats at dusk.',
    order: 2
  },
  {
    tag: 'lagoon-safari',
    question: 'Are lagoon safaris suitable for children and elderly visitors?',
    answer: 'Yes, lagoon safaris are excellent for all ages. Boats are stable and safe with life jackets provided for everyone. The calm water makes it comfortable even for those prone to seasickness. Most tours can be customized for duration and activities. For elderly visitors, we ensure easy boarding and comfortable seating. Children love the fish spa and seeing wildlife up close.',
    order: 3
  },
  {
    tag: 'lagoon-safari',
    question: 'What should I bring on a lagoon safari?',
    answer: 'Essential items include sunscreen (eco-friendly preferred), hat, sunglasses, camera with zoom lens, and water bottle. Wear light, comfortable clothing and bring a light rain jacket during monsoon season. Insect repellent is useful for mangrove areas. Binoculars enhance wildlife viewing. Avoid bright colors that might disturb animals - earth tones are best.',
    order: 4
  },
  {
    tag: 'lagoon-safari',
    question: 'Can I swim during the lagoon safari?',
    answer: 'Swimming is generally not recommended in lagoon waters due to strong currents in some areas and presence of wildlife. However, some tours include stops at safe, designated areas for the natural fish spa experience where tiny fish nibble dead skin from your feet. Always follow your guide\'s instructions about water activities for safety.',
    order: 5
  },
  {
    tag: 'lagoon-safari',
    question: 'What is the cinnamon island experience about?',
    answer: 'Cinnamon islands are unique to certain lagoons where families have cultivated Ceylon cinnamon for generations. You\'ll see the traditional process of harvesting, peeling, and drying cinnamon bark. Local families demonstrate their skills and explain the cinnamon trade\'s history. You can purchase fresh cinnamon products directly from producers - it\'s fascinating cultural immersion along with nature.',
    order: 6
  }
];

async function seedLagoonSafariData() {
  try {
    console.log('🛶 Starting lagoon safari data seeding...');

    // 1. Seed the main experience document
    console.log('📝 Creating lagoon safari experience document...');
    await setDoc(doc(db, 'experiences', 'lagoon-safari'), lagoonSafariData);
    console.log('✅ Experience document created successfully');

    // 2. Seed sample tours
    console.log('🎫 Creating sample tour documents...');
    for (const tour of sampleTours) {
      const docRef = await addDoc(collection(db, 'tours'), tour);
      console.log(`✅ Tour created: ${tour.title} (ID: ${docRef.id})`);
    }

    // 3. Seed FAQs
    console.log('❓ Creating FAQ documents...');
    for (const faq of sampleFAQs) {
      const docRef = await addDoc(collection(db, 'faqs'), faq);
      console.log(`✅ FAQ created: "${faq.question}" (ID: ${docRef.id})`);
    }

    console.log('🎉 All lagoon safari data seeded successfully!');
    console.log('📊 Summary:');
    console.log(`   - 1 experience document`);
    console.log(`   - ${sampleTours.length} tour documents`);
    console.log(`   - ${sampleFAQs.length} FAQ documents`);

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedLagoonSafariData().then(() => {
  console.log('🏁 Seeding complete!');
  process.exit(0);
});