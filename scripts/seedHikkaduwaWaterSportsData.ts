import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, addDoc } from 'firebase/firestore';
import hikkaduwaWaterSportsData from '../src/data/seed-hikkaduwa-water-sports.json';

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

// Sample tours data for Hikkaduwa water sports
const sampleTours = [
  {
    experienceSlug: 'hikkaduwa-water-sports',
    title: 'Learn to Surf - Beginner Package',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Fhikka-surf-beginner.webp?alt=media',
    badges: ['Beginner Friendly', 'ISA Certified'],
    duration: '2 hours',
    salePriceUSD: 45,
    regularPriceUSD: 60,
    isPublished: true,
    description: 'Perfect introduction to surfing with ISA-certified instructors on gentle reef breaks.',
    highlights: [
      'Professional ISA-certified instructor',
      'Soft-top surfboard and rash guard included',
      'Maximum 4 students per instructor',
      'Beach theory session before water time'
    ]
  },
  {
    experienceSlug: 'hikkaduwa-water-sports',
    title: 'Turtle Reef Snorkeling Adventure',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Fhikka-turtle-snorkel.webp?alt=media',
    badges: ['Wildlife', 'Eco-Friendly'],
    duration: '3 hours',
    salePriceUSD: 35,
    regularPriceUSD: 45,
    isPublished: true,
    description: 'Snorkel with sea turtles and explore vibrant coral reefs in protected marine sanctuary.',
    highlights: [
      'Quality snorkeling equipment provided',
      'Marine biologist guide',
      'Glass-bottom boat option available',
      'Underwater photography service'
    ]
  },
  {
    experienceSlug: 'hikkaduwa-water-sports',
    title: 'Jet Ski & Banana Boat Combo',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Fhikka-jetski-combo.webp?alt=media',
    badges: ['Adrenaline', 'Group Fun'],
    duration: '1.5 hours',
    salePriceUSD: 85,
    regularPriceUSD: 100,
    isPublished: true,
    description: 'High-speed water adventures combining solo jet ski rides with group banana boat fun.',
    highlights: [
      '30 minutes jet ski rental',
      '2 banana boat rides (15 min each)',
      'Safety briefing and life jackets',
      'Free action photos included'
    ]
  },
  {
    experienceSlug: 'hikkaduwa-water-sports',
    title: 'Sunset SUP Lagoon Safari',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Fhikka-sup-sunset.webp?alt=media',
    badges: ['Scenic', 'Peaceful'],
    duration: '1.5 hours',
    salePriceUSD: 55,
    regularPriceUSD: 70,
    isPublished: true,
    description: 'Paddle through calm lagoon waters as the sun sets over mangrove forests.',
    highlights: [
      'Inflatable SUP board and paddle',
      'Basic SUP instruction included',
      'Waterproof phone pouch provided',
      'Sunset photography spots'
    ]
  },
  {
    experienceSlug: 'hikkaduwa-water-sports',
    title: 'Full Day Water Sports Pass',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Fhikka-full-day-pass.webp?alt=media',
    badges: ['Best Value', 'All-Inclusive'],
    duration: '8 hours',
    salePriceUSD: 165,
    regularPriceUSD: 220,
    isPublished: true,
    description: 'Ultimate water sports experience with surfing, snorkeling, jet ski, and SUP all included.',
    highlights: [
      '2-hour surf lesson',
      'Turtle reef snorkeling trip',
      '20-minute jet ski session',
      'SUP rental for 1 hour',
      'Lunch and refreshments included'
    ]
  },
  {
    experienceSlug: 'hikkaduwa-water-sports',
    title: 'Glass Bottom Boat Marine Tour',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Fhikka-glass-boat.webp?alt=media',
    badges: ['Family-Friendly', 'No Swimming'],
    duration: '2 hours',
    salePriceUSD: 25,
    isPublished: true,
    description: 'Perfect for non-swimmers to experience the underwater world through glass panels.',
    highlights: [
      'Comfortable glass-bottom boat',
      'Marine life commentary',
      'Turtle feeding opportunity',
      'Suitable for all ages'
    ]
  }
];

// Sample FAQs for Hikkaduwa water sports
const sampleFAQs = [
  {
    tag: 'hikkaduwa-water-sports',
    question: 'What is the best time of year for water sports in Hikkaduwa?',
    answer: 'The best time is from November to April when the seas are calmer and visibility is excellent for snorkeling. Surfing is good year-round with different breaks working in different seasons. May to October brings bigger swells suitable for intermediate surfers, while November to April offers gentler waves perfect for beginners.',
    order: 1
  },
  {
    tag: 'hikkaduwa-water-sports',
    question: 'Do I need to know how to swim for all water sports activities?',
    answer: 'Swimming ability requirements vary by activity. For surfing and SUP, basic swimming skills are essential. Snorkeling requires comfortable floating abilities. Jet skiing and banana boat rides provide life jackets but swimming knowledge is recommended. We offer glass-bottom boat tours for non-swimmers who want to see marine life.',
    order: 2
  },
  {
    tag: 'hikkaduwa-water-sports',
    question: 'Is all equipment provided or should I bring my own?',
    answer: 'All essential equipment is provided including surfboards, wetsuits/rash guards, snorkeling gear, SUP boards, and safety equipment. Everything is regularly sanitized and maintained. You\'re welcome to bring your own gear if preferred. We recommend bringing reef-safe sunscreen, water, and a towel.',
    order: 3
  },
  {
    tag: 'hikkaduwa-water-sports',
    question: 'Are the water sports activities safe for children?',
    answer: 'Yes, we offer child-friendly options for most activities. Children 8+ can take surf lessons with special instructors. Snorkeling is suitable for confident swimmers aged 6+. Banana boat rides welcome kids 10+ with parental consent. All children are provided with properly fitting safety equipment and close supervision.',
    order: 4
  },
  {
    tag: 'hikkaduwa-water-sports',
    question: 'What marine life can I expect to see while snorkeling?',
    answer: 'Hikkaduwa\'s coral sanctuary is home to diverse marine life. You\'ll likely see green sea turtles, hawksbill turtles, parrotfish, angelfish, butterflyfish, moray eels, and occasionally reef sharks. The coral gardens feature both hard and soft corals in vibrant colors. Best visibility is during morning hours.',
    order: 5
  },
  {
    tag: 'hikkaduwa-water-sports',
    question: 'Can I book private water sports lessons?',
    answer: 'Yes, private lessons are available for all activities. Private surf lessons offer 1-on-1 instruction for faster progress. Private snorkeling guides can take you to less crowded spots. Private jet ski tours explore the coastline extensively. Private lessons cost approximately 50% more than group sessions but provide personalized attention.',
    order: 6
  }
];

async function seedHikkaduwaWaterSportsData() {
  try {
    console.log('🏄 Starting Hikkaduwa water sports data seeding...');

    // 1. Seed the main experience document
    console.log('📝 Creating Hikkaduwa water sports experience document...');
    await setDoc(doc(db, 'experiences', 'hikkaduwa-water-sports'), hikkaduwaWaterSportsData);
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

    console.log('🎉 All Hikkaduwa water sports data seeded successfully!');
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
seedHikkaduwaWaterSportsData().then(() => {
  console.log('🏁 Seeding complete!');
  process.exit(0);
});