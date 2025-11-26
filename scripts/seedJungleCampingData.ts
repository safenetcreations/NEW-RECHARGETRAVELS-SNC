import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, addDoc } from 'firebase/firestore';
import jungleCampingData from '../src/data/seed-jungle-camping.json';

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

// Sample tours data for jungle camping
const sampleTours = [
  {
    experienceSlug: 'jungle-camping',
    title: 'Sinharaja Rainforest 2-Day Expedition',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Fjungle-sinharaja-2day.webp?alt=media',
    badges: ['UNESCO Site', 'Endemic Wildlife'],
    duration: '2 days / 1 night',
    salePriceUSD: 185,
    regularPriceUSD: 220,
    isPublished: true,
    description: 'Deep immersion into Sri Lanka\'s last viable rainforest with expert naturalist guides and eco-camping.',
    highlights: [
      'Guided rainforest treks with naturalist',
      'Endemic bird watching at dawn',
      'Waterfall swimming and meditation',
      'All meals cooked over campfire',
      'Leave-no-trace camping equipment'
    ]
  },
  {
    experienceSlug: 'jungle-camping',
    title: 'Knuckles Mountain Wilderness Trek',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Fjungle-knuckles-trek.webp?alt=media',
    badges: ['Challenging', 'Cloud Forest'],
    duration: '3 days / 2 nights',
    salePriceUSD: 295,
    regularPriceUSD: 350,
    isPublished: true,
    description: 'Traverse misty cloud forests and pristine montane wilderness in the dramatic Knuckles Range.',
    highlights: [
      'Multi-terrain trekking through 5 ecosystems',
      'Camp at 1500m elevation with mountain views',
      'Visit remote villages and tea estates',
      'Professional trekking guide and porter team',
      'Mobile fly-camping with chef'
    ]
  },
  {
    experienceSlug: 'jungle-camping',
    title: 'Family Jungle Adventure Camp',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Fjungle-family-camp.webp?alt=media',
    badges: ['Family-Friendly', 'Educational'],
    duration: '1 night',
    salePriceUSD: 125,
    regularPriceUSD: 150,
    isPublished: true,
    description: 'Gentle jungle camping experience designed for families with children aged 6+.',
    highlights: [
      'Easy nature walks and wildlife spotting',
      'Junior ranger activities for kids',
      'Comfortable safari-style tents',
      'Campfire stories and marshmallows',
      'Safety-first approach for families'
    ]
  },
  {
    experienceSlug: 'jungle-camping',
    title: 'Wildlife Photography Jungle Safari',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Fjungle-photo-safari.webp?alt=media',
    badges: ['Photography', 'Small Group'],
    duration: '2 days / 1 night',
    salePriceUSD: 245,
    regularPriceUSD: 290,
    isPublished: true,
    description: 'Specialized camping safari for wildlife photographers with hide setups and expert guidance.',
    highlights: [
      'Pre-dawn and dusk photography sessions',
      'Portable bird hides and camouflage',
      'Wildlife photography expert guide',
      'Night macro photography workshop',
      'Maximum 4 photographers per group'
    ]
  },
  {
    experienceSlug: 'jungle-camping',
    title: 'Wasgamuwa Elephant Safari Camp',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Fjungle-wasgamuwa-elephants.webp?alt=media',
    badges: ['Wildlife', 'River Camp'],
    duration: '1 night',
    salePriceUSD: 165,
    regularPriceUSD: 195,
    isPublished: true,
    description: 'Camp by the river in Wasgamuwa buffer zone with excellent elephant and wildlife viewing.',
    highlights: [
      'Riverside camping with elephant views',
      'Morning and evening jeep safaris',
      'River boat wildlife cruise',
      'Traditional Sri Lankan camp meals',
      'Park permits and fees included'
    ]
  },
  {
    experienceSlug: 'jungle-camping',
    title: 'Extreme Jungle Survival Experience',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Fjungle-survival-extreme.webp?alt=media',
    badges: ['Adventure', 'Skills Training'],
    duration: '2 days / 1 night',
    salePriceUSD: 195,
    regularPriceUSD: 240,
    isPublished: true,
    description: 'Learn jungle survival skills from ex-military guides while camping in remote wilderness.',
    highlights: [
      'Bushcraft and survival skills training',
      'Fire-making without matches',
      'Edible plant identification',
      'Shelter building techniques',
      'Navigation without compass'
    ]
  }
];

// Sample FAQs for jungle camping
const sampleFAQs = [
  {
    tag: 'jungle-camping',
    question: 'Is jungle camping safe in Sri Lanka?',
    answer: 'Yes, jungle camping with Recharge Travels is very safe. We camp in designated buffer zones with permits, use raised platforms away from wildlife paths, and our guides are trained in wilderness first aid. All camps have communication equipment, and we maintain strict safety protocols including wildlife awareness briefings. Dangerous animals like elephants and leopards avoid human camps, and our guides know how to minimize any risks.',
    order: 1
  },
  {
    tag: 'jungle-camping',
    question: 'What camping equipment is provided and what should I bring?',
    answer: 'We provide all camping essentials: quality tents, sleeping bags rated for jungle conditions, foam mattresses, camp chairs, cooking equipment, and first aid supplies. You should bring personal items like suitable clothing (long sleeves/pants), sturdy shoes, insect repellent, headlamp, personal medications, and toiletries. We\'ll send a detailed packing list upon booking.',
    order: 2
  },
  {
    tag: 'jungle-camping',
    question: 'What about toilet facilities and hygiene in the jungle?',
    answer: 'We set up eco-friendly portable toilet tents at each campsite with privacy and proper waste management following leave-no-trace principles. Hand-washing stations with biodegradable soap are provided. For remote treks, we dig cat-holes following wilderness ethics. All waste is carried out. Despite being in the jungle, basic hygiene standards are maintained throughout.',
    order: 3
  },
  {
    tag: 'jungle-camping',
    question: 'What kind of wildlife might we encounter while camping?',
    answer: 'Sri Lankan jungles host incredible biodiversity. Commonly seen: endemic birds (Ceylon junglefowl, hanging parrots), purple-faced langurs, giant squirrels, monitor lizards, and numerous butterflies. Lucky sightings include mouse-deer, fishing cats, or even leopard pugmarks. At night: owls, nightjars, and fireflies. Elephants are present in some areas but avoid camps. Our guides are expert wildlife spotters.',
    order: 4
  },
  {
    tag: 'jungle-camping',
    question: 'Can children participate in jungle camping trips?',
    answer: 'Yes, we offer family-friendly jungle camping suitable for children aged 6 and above. These trips feature easier trails, comfortable safari-style tents, engaging nature activities for kids, and camp locations with vehicle access. For safety, children must stay with adults at all times. Our family camps include special meals kids enjoy and educational wildlife experiences.',
    order: 5
  },
  {
    tag: 'jungle-camping',
    question: 'What happens if it rains during our camping trip?',
    answer: 'Rain is part of the rainforest experience! Our tents are fully waterproof with rain-flies and elevated platforms keep you dry. We provide rain ponchos and pack covers. Cooking areas have tarp shelters. Light rain often brings out more wildlife and creates a magical atmosphere with mist and fresh jungle scents. Heavy monsoons may require itinerary adjustments for safety.',
    order: 6
  }
];

async function seedJungleCampingData() {
  try {
    console.log('🏕️ Starting jungle camping data seeding...');

    // 1. Seed the main experience document
    console.log('📝 Creating jungle camping experience document...');
    await setDoc(doc(db, 'experiences', 'jungle-camping'), jungleCampingData);
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

    console.log('🎉 All jungle camping data seeded successfully!');
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
seedJungleCampingData().then(() => {
  console.log('🏁 Seeding complete!');
  process.exit(0);
});