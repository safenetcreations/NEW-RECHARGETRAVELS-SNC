import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, addDoc } from 'firebase/firestore';
import pilgrimageToursData from '../src/data/seed-pilgrimage-tours.json';

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

// Sample tours data for pilgrimage tours
const sampleTours = [
  {
    experienceSlug: 'pilgrimage-tours',
    title: 'Sacred Triangle Pilgrimage - 3 Day Journey',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Fsacred-triangle-tour.webp?alt=media',
    badges: ['Most Popular', 'Guided Tour'],
    duration: '3 days / 2 nights',
    salePriceUSD: 285,
    regularPriceUSD: 350,
    isPublished: true,
    description: 'Visit Kandy Temple of the Tooth, Anuradhapura Sacred Bo Tree, and Polonnaruwa ancient city.',
    highlights: [
      'Expert religious guide throughout journey',
      'All temple entrance fees included',
      'Traditional vegetarian meals',
      'Heritage hotel accommodations'
    ]
  },
  {
    experienceSlug: 'pilgrimage-tours',
    title: 'Adam\'s Peak Sunrise Pilgrimage',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Fadams-peak-tour.webp?alt=media',
    badges: ['Challenging', 'Spiritual'],
    duration: '2 days / 1 night',
    salePriceUSD: 125,
    regularPriceUSD: 150,
    isPublished: true,
    description: 'Experience the sacred night climb to witness sunrise from Sri Lanka\'s holiest peak.',
    highlights: [
      'Professional mountain guide',
      'Pre-climb dinner and post-climb breakfast',
      'Rest house accommodation',
      'Walking stick and flashlight provided'
    ]
  },
  {
    experienceSlug: 'pilgrimage-tours',
    title: 'Multi-Faith Harmony Tour',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Fmulti-faith-tour.webp?alt=media',
    badges: ['Educational', 'Inclusive'],
    duration: '4 days / 3 nights',
    salePriceUSD: 395,
    regularPriceUSD: 480,
    isPublished: true,
    description: 'Visit Buddhist, Hindu, Christian and Muslim sacred sites across Sri Lanka.',
    highlights: [
      'Kataragama multi-faith complex',
      'Madhu Church and Nallur Temple',
      'Jami Ul-Alfar Mosque in Colombo',
      'Inter-faith dialogue sessions'
    ]
  },
  {
    experienceSlug: 'pilgrimage-tours',
    title: 'Buddhist Heritage Circuit',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Fbuddhist-heritage-tour.webp?alt=media',
    badges: ['Heritage', 'UNESCO Sites'],
    duration: '5 days / 4 nights',
    salePriceUSD: 445,
    regularPriceUSD: 550,
    isPublished: true,
    description: 'Comprehensive tour of ancient Buddhist capitals and meditation centers.',
    highlights: [
      'Anuradhapura and Polonnaruwa UNESCO sites',
      'Dambulla Cave Temple complex',
      'Meditation session with monks',
      'Alms giving ceremony participation'
    ]
  },
  {
    experienceSlug: 'pilgrimage-tours',
    title: 'Weekend Spiritual Retreat',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Fspiritual-retreat-tour.webp?alt=media',
    badges: ['Wellness', 'Weekend'],
    duration: '2 days / 1 night',
    salePriceUSD: 165,
    isPublished: true,
    description: 'Short spiritual journey combining temple visits with meditation and wellness.',
    highlights: [
      'Kandy Temple evening ceremony',
      'Morning meditation session',
      'Ayurvedic wellness consultation',
      'Organic vegetarian meals'
    ]
  },
  {
    experienceSlug: 'pilgrimage-tours',
    title: 'Ramayana Trail Pilgrimage',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Framayana-trail-tour.webp?alt=media',
    badges: ['Mythology', 'Hindu Heritage'],
    duration: '6 days / 5 nights',
    salePriceUSD: 595,
    regularPriceUSD: 750,
    isPublished: true,
    description: 'Follow the epic Ramayana trail through Lanka\'s legendary sites.',
    highlights: [
      'Sita Amman Temple and Ashok Vatika',
      'Ravana Falls and Caves',
      'Divurumpola and Rumassala',
      'Expert mythology guide throughout'
    ]
  }
];

// Sample FAQs for pilgrimage tours
const sampleFAQs = [
  {
    tag: 'pilgrimage-tours',
    question: 'What should I wear when visiting temples and religious sites?',
    answer: 'Modest clothing is essential at all religious sites. Both men and women should cover shoulders and knees. Wear white or light colors for Buddhist temples (avoid black). Remove shoes and hats before entering shrines. Some temples provide sarongs if needed. We recommend bringing a scarf to cover shoulders and comfortable slip-off shoes.',
    order: 1
  },
  {
    tag: 'pilgrimage-tours',
    question: 'Are the pilgrimage tours suitable for all fitness levels?',
    answer: 'Most pilgrimage tours are suitable for moderate fitness levels, except Adam\'s Peak which requires good physical condition for the 5,500-step climb. Temple visits involve walking and climbing stairs. We offer alternative arrangements for elderly visitors or those with mobility issues, including vehicle access where permitted and shorter route options.',
    order: 2
  },
  {
    tag: 'pilgrimage-tours',
    question: 'Can non-religious visitors join pilgrimage tours?',
    answer: 'Absolutely! Our pilgrimage tours welcome visitors of all faiths and those interested in cultural experiences. The tours focus on historical, architectural, and cultural aspects alongside spiritual elements. Our guides provide context from both religious and secular perspectives, making the experience enriching for everyone.',
    order: 3
  },
  {
    tag: 'pilgrimage-tours',
    question: 'What are the photography restrictions at religious sites?',
    answer: 'Photography rules vary by site. Generally, you cannot photograph Buddha statues with your back to them, and flash photography is prohibited inside shrines. Some areas ban photography entirely. Video recording often requires special permits. Our guides will inform you of specific restrictions at each location.',
    order: 4
  },
  {
    tag: 'pilgrimage-tours',
    question: 'Do pilgrimage tours include meals with dietary restrictions?',
    answer: 'Yes, we accommodate various dietary needs. Most pilgrimage tours include vegetarian meals, which are standard at religious sites. We can arrange vegan, gluten-free, or other special diets with advance notice. Many Buddhist sites serve only vegetarian food, while Hindu temples may have specific dietary customs we\'ll explain.',
    order: 5
  },
  {
    tag: 'pilgrimage-tours',
    question: 'What special preparations are needed for Adam\'s Peak climb?',
    answer: 'For Adam\'s Peak, bring warm clothing (temperatures can drop to 5°C at summit), comfortable hiking shoes, flashlight/headlamp, rain jacket, water bottles, and energy snacks. The climb typically starts at 2 AM to reach the summit by sunrise. We provide walking sticks and can arrange porters if needed. The climb takes 3-5 hours depending on fitness.',
    order: 6
  }
];

async function seedPilgrimageToursData() {
  try {
    console.log('🙏 Starting pilgrimage tours data seeding...');

    // 1. Seed the main experience document
    console.log('📝 Creating pilgrimage tours experience document...');
    await setDoc(doc(db, 'experiences', 'pilgrimage-tours'), pilgrimageToursData);
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

    console.log('🎉 All pilgrimage tours data seeded successfully!');
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
seedPilgrimageToursData().then(() => {
  console.log('🏁 Seeding complete!');
  process.exit(0);
});