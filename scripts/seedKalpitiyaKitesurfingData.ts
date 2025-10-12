import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, addDoc } from 'firebase/firestore';
import kalpitiyaKitesurfingData from '../src/data/seed-kalpitiya-kitesurfing.json';

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

// Sample tours data for Kalpitiya kitesurfing
const sampleTours = [
  {
    experienceSlug: 'kalpitiya-kitesurfing',
    title: 'Beginner 3-Day IKO Certification Course',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Fkite-beginner-course.webp?alt=media',
    badges: ['IKO Certified', 'All Equipment'],
    duration: '3 days',
    salePriceUSD: 350,
    regularPriceUSD: 420,
    isPublished: true,
    description: 'Complete IKO Level 1-2 certification with 9 hours of personalized instruction on flat lagoon water.',
    highlights: [
      'IKO certified instructors',
      'Radio helmet communication',
      'All equipment included (Duotone gear)',
      'Maximum 2 students per instructor',
      'Certificate upon completion'
    ]
  },
  {
    experienceSlug: 'kalpitiya-kitesurfing',
    title: 'Advanced Freestyle Coaching Package',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Fkite-freestyle-coaching.webp?alt=media',
    badges: ['Advanced', 'Video Analysis'],
    duration: '5 days',
    salePriceUSD: 450,
    regularPriceUSD: 550,
    isPublished: true,
    description: 'Master advanced tricks with video analysis and pro coaching on butter-flat lagoon conditions.',
    highlights: [
      'Daily video analysis sessions',
      'Trick progression coaching',
      'Latest freestyle equipment',
      'Boat support to best spots',
      'Personal progress report'
    ]
  },
  {
    experienceSlug: 'kalpitiya-kitesurfing',
    title: 'Ocean Downwinder Safari Adventure',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Fkite-downwinder-safari.webp?alt=media',
    badges: ['Adventure', 'Intermediate+'],
    duration: '1 day',
    salePriceUSD: 125,
    regularPriceUSD: 150,
    isPublished: true,
    description: 'Epic 15km downwind journey along pristine coastline with dolphin encounters and beach BBQ.',
    highlights: [
      '15km downwind adventure',
      'Safety boat escort throughout',
      'Beach BBQ lunch stop',
      'Dolphin spotting opportunities',
      'Return transport included'
    ]
  },
  {
    experienceSlug: 'kalpitiya-kitesurfing',
    title: 'Kite & Stay Beachfront Package',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Fkite-stay-package.webp?alt=media',
    badges: ['All-Inclusive', '7 Nights'],
    duration: '7 nights / 6 days',
    salePriceUSD: 890,
    regularPriceUSD: 1100,
    isPublished: true,
    description: 'Complete kite holiday with beachfront accommodation, daily sessions, and equipment rental.',
    highlights: [
      '7 nights beachfront accommodation',
      'Daily breakfast and lunch',
      'Unlimited equipment rental',
      'Free lagoon shuttle service',
      'Welcome dinner and BBQ nights'
    ]
  },
  {
    experienceSlug: 'kalpitiya-kitesurfing',
    title: 'Wave Riding Progression Course',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Fkite-wave-riding.webp?alt=media',
    badges: ['Waves', 'Advanced'],
    duration: '3 days',
    salePriceUSD: 295,
    regularPriceUSD: 350,
    isPublished: true,
    description: 'Transition from flat water to waves with expert coaching at Kappalady wave spot.',
    highlights: [
      'Wave riding technique coaching',
      'Boat transfers to wave spots',
      'Surfboard and directional boards',
      'Safety protocols for waves',
      'Video feedback sessions'
    ]
  },
  {
    experienceSlug: 'kalpitiya-kitesurfing',
    title: 'Girls Only Kite Camp',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Fkite-girls-camp.webp?alt=media',
    badges: ['Women Only', 'Supportive'],
    duration: '5 days',
    salePriceUSD: 425,
    regularPriceUSD: 500,
    isPublished: true,
    description: 'Empowering all-female kite camp with female instructors in a supportive environment.',
    highlights: [
      'Female IKO instructors only',
      'Small group (max 6 participants)',
      'Yoga and fitness sessions',
      'Shared accommodation option',
      'Community dinner nights'
    ]
  }
];

// Sample FAQs for Kalpitiya kitesurfing
const sampleFAQs = [
  {
    tag: 'kalpitiya-kitesurfing',
    question: 'What makes Kalpitiya ideal for kitesurfing?',
    answer: 'Kalpitiya offers perfect kitesurfing conditions with steady side-shore trade winds (20-28 knots), butter-flat lagoon water for beginners, and consistent wind seasons from May-October and December-February. The massive shallow lagoon provides safe learning conditions while nearby ocean spots offer waves and downwinders for advanced riders. Plus, uncrowded beaches mean plenty of space to launch and ride.',
    order: 1
  },
  {
    tag: 'kalpitiya-kitesurfing',
    question: 'Do I need previous experience to start kitesurfing in Kalpitiya?',
    answer: 'No previous experience is needed! Kalpitiya\'s flat, shallow lagoon is ideal for beginners. Our IKO-certified instructors start with land-based kite control, then shallow water body dragging before progressing to board skills. Most students are riding independently within 3-5 days. The steady wind and flat water make Kalpitiya one of the world\'s best places to learn kitesurfing.',
    order: 2
  },
  {
    tag: 'kalpitiya-kitesurfing',
    question: 'What equipment do I need and is rental available?',
    answer: 'All equipment is available for rent including latest model Duotone kites (various sizes for different wind conditions), boards, harnesses, helmets, and impact vests. For lessons, everything is included. If you\'re an independent rider, daily rental packages are available. We recommend bringing your own wetsuit/rashguard, though these can also be rented. Equipment is maintained to highest safety standards.',
    order: 3
  },
  {
    tag: 'kalpitiya-kitesurfing',
    question: 'When is the best wind season for kitesurfing in Kalpitiya?',
    answer: 'Kalpitiya has two main wind seasons: May to October (southwest monsoon) and December to February (northeast monsoon). During these periods, wind is remarkably consistent with 20-28 knot side-shore conditions almost daily. July-August and January are peak months with strongest winds. November and March-April have lighter winds suitable for beginners using larger kites.',
    order: 4
  },
  {
    tag: 'kalpitiya-kitesurfing',
    question: 'What other activities are available in Kalpitiya besides kitesurfing?',
    answer: 'Kalpitiya offers amazing marine life experiences including dolphin watching (massive pods of spinner dolphins), whale watching (November-April), and snorkeling at Bar Reef Marine Sanctuary. The area also features mangrove kayaking, stand-up paddleboarding, cycling through coconut plantations, and visiting nearby Wilpattu National Park for leopard safaris. Many kiters combine these activities on rest days.',
    order: 5
  },
  {
    tag: 'kalpitiya-kitesurfing',
    question: 'Where should I stay in Kalpitiya for kitesurfing?',
    answer: 'Most kitesurfers stay along the beach strip between Kalpitiya town and the lagoon, where kite schools and launch spots are located. Options range from budget kite hostels to luxury eco-resorts. Many accommodations offer kite storage, equipment wash areas, and rescue boat services. We recommend beachfront properties for easy access to launch spots and can arrange packages including accommodation.',
    order: 6
  }
];

async function seedKalpitiyaKitesurfingData() {
  try {
    console.log('🪁 Starting Kalpitiya kitesurfing data seeding...');

    // 1. Seed the main experience document
    console.log('📝 Creating Kalpitiya kitesurfing experience document...');
    await setDoc(doc(db, 'experiences', 'kalpitiya-kitesurfing'), kalpitiyaKitesurfingData);
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

    console.log('🎉 All Kalpitiya kitesurfing data seeded successfully!');
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
seedKalpitiyaKitesurfingData().then(() => {
  console.log('🏁 Seeding complete!');
  process.exit(0);
});