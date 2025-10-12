import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, addDoc } from 'firebase/firestore';
import whaleWatchingData from '../data/seed-whale-watching.json';

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

// Sample tours data
const sampleTours = [
  {
    experienceSlug: 'whale-watching',
    title: 'Mirissa Blue Whale Safari - Morning Departure',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Fmirissa-whale-tour-1.webp?alt=media',
    badges: ['Most Popular', 'Eco-Certified'],
    duration: '3-4 hours',
    salePriceUSD: 65,
    regularPriceUSD: 80,
    isPublished: true,
    description: 'Join our most popular whale watching tour departing from Mirissa harbor at sunrise.',
    highlights: [
      'Professional marine biologist guide',
      'Complimentary breakfast on board',
      'Hydrophone for whale sounds',
      '95% whale sighting success rate'
    ]
  },
  {
    experienceSlug: 'whale-watching',
    title: 'Kalpitiya Dolphin & Whale Combo Tour',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Fkalpitiya-dolphin-tour.webp?alt=media',
    badges: ['Best Value', 'Small Group'],
    duration: '3 hours',
    salePriceUSD: 55,
    regularPriceUSD: 70,
    isPublished: true,
    description: 'Experience both playful dolphins and majestic whales in one unforgettable tour.',
    highlights: [
      'Maximum 12 guests per boat',
      'Snorkeling equipment included',
      'Light refreshments provided',
      'Underwater viewing windows'
    ]
  },
  {
    experienceSlug: 'whale-watching',
    title: 'Trincomalee Premium Whale Watching Experience',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Ftrincomalee-whale-tour.webp?alt=media',
    badges: ['Premium', 'Private Available'],
    duration: '4 hours',
    salePriceUSD: 85,
    regularPriceUSD: 100,
    isPublished: true,
    description: 'Luxury whale watching experience with premium amenities and extended ocean time.',
    highlights: [
      'Luxury catamaran with sun deck',
      'Gourmet breakfast included',
      'Professional photographer on board',
      'Complimentary photos of your trip'
    ]
  },
  {
    experienceSlug: 'whale-watching',
    title: 'Family-Friendly Whale Discovery Tour',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Ffamily-whale-tour.webp?alt=media',
    badges: ['Family-Friendly', 'Educational'],
    duration: '3 hours',
    salePriceUSD: 45,
    isPublished: true,
    description: 'Perfect for families with children, featuring educational activities and safety features.',
    highlights: [
      'Kid-friendly educational materials',
      'Safety railings and life jackets for all ages',
      'Interactive marine life guide',
      'Shorter duration ideal for children'
    ]
  },
  {
    experienceSlug: 'whale-watching',
    title: 'Photographer\'s Special - Golden Hour Safari',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Fphotography-whale-tour.webp?alt=media',
    badges: ['Photography', 'Sunrise'],
    duration: '4 hours',
    salePriceUSD: 95,
    regularPriceUSD: 120,
    isPublished: true,
    description: 'Designed for photography enthusiasts with optimal lighting and stable viewing platforms.',
    highlights: [
      'Early morning golden hour departure',
      'Stable photography platforms',
      'Expert photography guide included',
      'Maximum 8 photographers per tour'
    ]
  },
  {
    experienceSlug: 'whale-watching',
    title: 'Budget-Friendly Whale Watching Adventure',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Fbudget-whale-tour.webp?alt=media',
    badges: ['Budget-Friendly', 'Group Tour'],
    duration: '3 hours',
    salePriceUSD: 35,
    isPublished: true,
    description: 'Affordable whale watching experience without compromising on the adventure.',
    highlights: [
      'Experienced local captain',
      'Basic refreshments included',
      'Shared tour with other travelers',
      'All safety equipment provided'
    ]
  }
];

// Sample FAQs
const sampleFAQs = [
  {
    tag: 'whale-watching',
    question: 'When is the best time to go whale watching in Sri Lanka?',
    answer: 'The best time varies by location. For Mirissa and the south coast, December to April offers the highest chance of blue whale sightings. For Trincomalee and the east coast, May to September is ideal. Kalpitiya is excellent for dolphins year-round, with whales more common from November to March.',
    order: 1
  },
  {
    tag: 'whale-watching',
    question: 'What types of whales can I see in Sri Lankan waters?',
    answer: 'Sri Lanka is famous for blue whales, the largest animals on Earth. You can also spot sperm whales, fin whales, sei whales, and occasionally killer whales (orcas). Additionally, you\'ll likely see various dolphin species including spinner dolphins, bottlenose dolphins, and Risso\'s dolphins.',
    order: 2
  },
  {
    tag: 'whale-watching',
    question: 'Is whale watching safe and eco-friendly?',
    answer: 'Yes, when done with certified operators like Recharge Travels. We follow World Cetacean Alliance guidelines, maintaining safe distances (100m from whales, 50m from dolphins), limiting viewing time, and never chasing or encircling marine life. Our boats are equipped with safety equipment and our captains are trained in responsible wildlife viewing.',
    order: 3
  },
  {
    tag: 'whale-watching',
    question: 'What should I bring on a whale watching tour?',
    answer: 'Essential items include sunscreen (reef-safe preferred), sunglasses, a hat, camera with zoom lens, light jacket (it can be cool on the water), motion sickness medication if prone to seasickness, and a reusable water bottle. We provide life jackets, some snacks, and basic refreshments on all tours.',
    order: 4
  },
  {
    tag: 'whale-watching',
    question: 'What happens if we don\'t see any whales?',
    answer: 'While we have a 85-95% success rate depending on the season, wildlife sightings can never be guaranteed. If no whales are spotted, many of our tour operators offer a 50% discount on a future trip. Even without whale sightings, you\'ll often see dolphins, sea turtles, flying fish, and various seabirds.',
    order: 5
  },
  {
    tag: 'whale-watching',
    question: 'Are the tours suitable for children and elderly passengers?',
    answer: 'Yes, we offer family-friendly tours with safety features for all ages. Our boats have proper railings, shaded areas, and stable platforms. For elderly passengers or those with mobility concerns, we recommend our larger catamarans which offer more stability and easier boarding. Please inform us of any special requirements when booking.',
    order: 6
  }
];

async function seedWhaleWatchingData() {
  try {
    console.log('🐋 Starting whale watching data seeding...');

    // 1. Seed the main experience document
    console.log('📝 Creating whale watching experience document...');
    await setDoc(doc(db, 'experiences', 'whale-watching'), whaleWatchingData);
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

    console.log('🎉 All whale watching data seeded successfully!');
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
seedWhaleWatchingData().then(() => {
  console.log('🏁 Seeding complete!');
  process.exit(0);
});