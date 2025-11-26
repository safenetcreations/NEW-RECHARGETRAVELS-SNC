import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, addDoc } from 'firebase/firestore';
import hotAirBalloonSigiriyaData from '../src/data/seed-hot-air-balloon-sigiriya.json';

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

// Sample tours data for hot air balloon Sigiriya
const sampleTours = [
  {
    experienceSlug: 'hot-air-balloon-sigiriya',
    title: 'Classic Sunrise Balloon Flight',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Fballoon-classic-sunrise.webp?alt=media',
    badges: ['Most Popular', 'Dawn Flight'],
    duration: '3.5 hours total',
    salePriceUSD: 210,
    regularPriceUSD: 250,
    isPublished: true,
    description: 'Experience the magic of sunrise over Sigiriya from a hot air balloon with champagne breakfast.',
    highlights: [
      '1-hour scenic flight at sunrise',
      'Hotel pickup at 4:30 AM',
      'Champagne breakfast after landing',
      'Flight certificate and photos'
    ]
  },
  {
    experienceSlug: 'hot-air-balloon-sigiriya',
    title: 'Private Romantic Balloon Experience',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Fballoon-private-romantic.webp?alt=media',
    badges: ['Exclusive', 'Romance'],
    duration: '3.5 hours total',
    salePriceUSD: 650,
    regularPriceUSD: 750,
    isPublished: true,
    description: 'Exclusive balloon basket for two with premium champagne and private landing celebration.',
    highlights: [
      'Private basket for 2 passengers only',
      'Premium champagne and gourmet breakfast',
      'Professional photographer included',
      'Luxury vehicle transfers'
    ]
  },
  {
    experienceSlug: 'hot-air-balloon-sigiriya',
    title: 'Photography Enthusiast Flight',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Fballoon-photography.webp?alt=media',
    badges: ['Photography', 'Extended Flight'],
    duration: '4 hours total',
    salePriceUSD: 275,
    regularPriceUSD: 320,
    isPublished: true,
    description: 'Extended flight time with stable basket positions designed for serious photographers.',
    highlights: [
      '75-minute extended flight time',
      'Stable photography positions',
      'Dawn golden hour timing',
      'RAW photo files from onboard camera'
    ]
  },
  {
    experienceSlug: 'hot-air-balloon-sigiriya',
    title: 'Family Balloon Adventure',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Fballoon-family.webp?alt=media',
    badges: ['Family-Friendly', 'Group Discount'],
    duration: '3.5 hours total',
    salePriceUSD: 180,
    regularPriceUSD: 210,
    isPublished: true,
    description: 'Family-friendly balloon ride with special rates for children and engaging commentary.',
    highlights: [
      'Children 5-12 years at 50% discount',
      'Family-friendly pilot commentary',
      'Kid-friendly breakfast options',
      'Family photo package included'
    ]
  },
  {
    experienceSlug: 'hot-air-balloon-sigiriya',
    title: 'VIP Balloon & Cultural Triangle Tour',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Fballoon-vip-combo.webp?alt=media',
    badges: ['VIP', 'Full Day'],
    duration: 'Full day experience',
    salePriceUSD: 450,
    regularPriceUSD: 550,
    isPublished: true,
    description: 'Combine balloon flight with private guided tour of Sigiriya Rock and Dambulla Caves.',
    highlights: [
      'Sunrise balloon flight',
      'Private guide for Sigiriya Rock',
      'Dambulla Cave Temple visit',
      'Luxury lunch at heritage hotel'
    ]
  },
  {
    experienceSlug: 'hot-air-balloon-sigiriya',
    title: 'Last Minute Balloon Seats',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Fballoon-last-minute.webp?alt=media',
    badges: ['Limited Availability', 'Quick Book'],
    duration: '3.5 hours total',
    salePriceUSD: 175,
    isPublished: true,
    description: 'Discounted rates for last-minute bookings within 48 hours of flight (subject to availability).',
    highlights: [
      'Same experience as classic flight',
      'Significant last-minute discount',
      'Book within 48 hours of flight',
      'Subject to weather and availability'
    ]
  }
];

// Sample FAQs for hot air balloon Sigiriya
const sampleFAQs = [
  {
    tag: 'hot-air-balloon-sigiriya',
    question: 'What time does the hot air balloon flight start and how long does it last?',
    answer: 'Hotel pickups begin between 4:30-5:00 AM depending on your location, arriving at the launch site by 5:45 AM for a 6:15 AM takeoff. The actual flight lasts approximately 60 minutes, followed by champagne breakfast and return to hotels by 9:30 AM. The entire experience takes about 3.5-4 hours from pickup to drop-off.',
    order: 1
  },
  {
    tag: 'hot-air-balloon-sigiriya',
    question: 'Is hot air ballooning safe? What safety measures are in place?',
    answer: 'Safety is our top priority. All pilots are licensed by the Civil Aviation Authority of Sri Lanka with thousands of flight hours. We use new Cameron balloons (world\'s leading manufacturer) maintained to international standards. Each flight includes comprehensive safety briefing, GPS tracking, ground chase crew, and 100% passenger insurance. Flights are cancelled if weather conditions aren\'t perfect.',
    order: 2
  },
  {
    tag: 'hot-air-balloon-sigiriya',
    question: 'What happens if my flight is cancelled due to weather?',
    answer: 'Weather cancellations are decided by 5:00 AM on flight day for passenger safety. If cancelled, you can choose to reschedule for the next available date or receive a full refund. We operate November through April when weather is most stable, but even then, about 15% of flights are cancelled for safety. We recommend booking early in your trip to allow rescheduling if needed.',
    order: 3
  },
  {
    tag: 'hot-air-balloon-sigiriya',
    question: 'Are there any age or health restrictions for hot air balloon rides?',
    answer: 'Children must be at least 5 years old and tall enough to see over the basket edge (minimum 1.2m/4ft). No upper age limit exists, but passengers must be able to stand for the flight duration and climb into the basket. Pregnant women and those with serious heart conditions or recent surgeries should consult their doctor. Maximum weight per passenger is 120kg (265lbs).',
    order: 4
  },
  {
    tag: 'hot-air-balloon-sigiriya',
    question: 'What should I wear and bring for the balloon flight?',
    answer: 'Dress in comfortable layers as early mornings are cool but it warms up after sunrise. Avoid loose scarves or hats that might blow away. Wear flat, closed shoes (no sandals or heels). Bring a camera/phone (we provide secure storage), sunglasses, and light jacket. Everything else including breakfast, water, and celebration champagne is provided.',
    order: 5
  },
  {
    tag: 'hot-air-balloon-sigiriya',
    question: 'How far in advance should I book my hot air balloon ride?',
    answer: 'Hot air balloon rides in Sigiriya are extremely popular with limited daily capacity (only 2-3 balloons operate). During peak season (December-March), book at least 2-3 months in advance. For other months, 3-4 weeks advance booking is recommended. Last-minute availability is rare but occasionally possible at discounted rates.',
    order: 6
  }
];

async function seedHotAirBalloonSigiriyaData() {
  try {
    console.log('🎈 Starting hot air balloon Sigiriya data seeding...');

    // 1. Seed the main experience document
    console.log('📝 Creating hot air balloon Sigiriya experience document...');
    await setDoc(doc(db, 'experiences', 'hot-air-balloon-sigiriya'), hotAirBalloonSigiriyaData);
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

    console.log('🎉 All hot air balloon Sigiriya data seeded successfully!');
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
seedHotAirBalloonSigiriyaData().then(() => {
  console.log('🏁 Seeding complete!');
  process.exit(0);
});