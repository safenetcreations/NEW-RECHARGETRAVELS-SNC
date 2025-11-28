import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, addDoc } from 'firebase/firestore';
import * as fs from 'fs';
import * as path from 'path';

// Load the JSON data
const jsonPath = path.join(process.cwd(), 'src', 'data', 'seed-cooking-class-sri-lanka.json');
const cookingClassData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

// Load environment variables from .env file
const envPath = path.join(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars: { [key: string]: string } = {};

envContent.split('\n').forEach(line => {
  const trimmedLine = line.trim();
  if (trimmedLine && !trimmedLine.startsWith('#')) {
    const [key, ...valueParts] = trimmedLine.split('=');
    const value = valueParts.join('=').trim();
    if (key && value) {
      envVars[key.trim()] = value.replace(/^["']|["']$/g, '');
    }
  }
});

// Firebase configuration
const firebaseConfig = {
  apiKey: envVars.VITE_FIREBASE_API_KEY,
  authDomain: envVars.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: envVars.VITE_FIREBASE_PROJECT_ID,
  storageBucket: envVars.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: envVars.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: envVars.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample tours data for cooking classes
const sampleTours = [
  {
    experienceSlug: 'cooking-class-sri-lanka',
    title: 'Essential Sri Lankan Cooking - Morning Session',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Fcooking-essential-morning.webp?alt=media',
    badges: ['Most Popular', 'Market Tour'],
    duration: '4 hours',
    salePriceUSD: 45,
    regularPriceUSD: 55,
    isPublished: true,
    description: 'Learn to prepare 5 authentic dishes including rice & curry, pol sambol, and dhal curry with market visit.',
    highlights: [
      'Guided spice market tour',
      '5 traditional dishes',
      'Recipe booklet included',
      'Lunch with your creations',
      'Certificate of completion'
    ]
  },
  {
    experienceSlug: 'cooking-class-sri-lanka',
    title: 'Master Chef Sri Lankan Experience',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Fcooking-masterchef.webp?alt=media',
    badges: ['Advanced', 'Small Group'],
    duration: '6 hours',
    salePriceUSD: 75,
    regularPriceUSD: 90,
    isPublished: true,
    description: 'Intensive cooking workshop covering 8-10 complex dishes with advanced spice blending techniques.',
    highlights: [
      '8-10 complex dishes',
      'Spice blending workshop',
      'Clay pot cooking methods',
      'Professional techniques',
      'Video recipe collection'
    ]
  },
  {
    experienceSlug: 'cooking-class-sri-lanka',
    title: 'Family Fun Cooking Class',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Fcooking-family-fun.webp?alt=media',
    badges: ['Family-Friendly', 'Kids Welcome'],
    duration: '2.5 hours',
    salePriceUSD: 35,
    regularPriceUSD: 45,
    isPublished: true,
    description: 'Kid-friendly cooking experience with simple recipes and fun activities for the whole family.',
    highlights: [
      'Simple, fun recipes',
      'Kids cooking stations',
      'Hopper making demo',
      'Fruit carving activity',
      'Family meal together'
    ]
  },
  {
    experienceSlug: 'cooking-class-sri-lanka',
    title: 'Vegetarian & Vegan Delights',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Fcooking-vegetarian.webp?alt=media',
    badges: ['Vegetarian', 'Organic'],
    duration: '4 hours',
    salePriceUSD: 55,
    regularPriceUSD: 65,
    isPublished: true,
    description: 'Plant-based cooking class featuring traditional vegetarian curries and Ayurvedic principles.',
    highlights: [
      'Organic ingredients',
      'Ayurvedic cooking principles',
      'Coconut milk extraction',
      'Jackfruit curry specialty',
      'Herbal tea preparation'
    ]
  },
  {
    experienceSlug: 'cooking-class-sri-lanka',
    title: 'Street Food & Snacks Workshop',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Fcooking-streetfood.webp?alt=media',
    badges: ['Street Food', 'Evening Class'],
    duration: '3 hours',
    salePriceUSD: 40,
    regularPriceUSD: 50,
    isPublished: true,
    description: 'Master popular Sri Lankan street foods including kottu roti, isso wade, and traditional snacks.',
    highlights: [
      'Kottu roti preparation',
      'Isso wade (prawn fritters)',
      'Traditional short eats',
      'Tea time snacks',
      'Street vendor techniques'
    ]
  },
  {
    experienceSlug: 'cooking-class-sri-lanka',
    title: 'Private Luxury Cooking Experience',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Fcooking-private-luxury.webp?alt=media',
    badges: ['Private', 'Luxury'],
    duration: '5 hours',
    salePriceUSD: 150,
    regularPriceUSD: 180,
    isPublished: true,
    description: 'Exclusive private cooking session with celebrity chef in premium kitchen with personalized menu.',
    highlights: [
      'Private celebrity chef',
      'Customized menu selection',
      'Premium ingredients',
      'Wine pairing option',
      'Personal recipe video'
    ]
  }
];

// Sample FAQs for cooking classes
const sampleFAQs = [
  {
    tag: 'cooking-class-sri-lanka',
    question: 'Do I need any cooking experience to join the class?',
    answer: 'No prior cooking experience is needed! Our classes cater to all skill levels, from complete beginners to experienced cooks. Our patient instructors guide you through each step, ensuring everyone can create delicious dishes regardless of their starting point. We offer different class levels to match your comfort and interest.',
    order: 1
  },
  {
    tag: 'cooking-class-sri-lanka',
    question: 'Are vegetarian and vegan options available?',
    answer: 'Absolutely! We offer dedicated vegetarian classes and can adapt most recipes to be vegan. Sri Lankan cuisine has many naturally vegetarian dishes including dhal curry, vegetable curries, and coconut-based dishes. Please inform us of dietary requirements when booking, and we\'ll customize the menu accordingly. We also accommodate allergies and other dietary restrictions.',
    order: 2
  },
  {
    tag: 'cooking-class-sri-lanka',
    question: 'What\'s included in the market visit?',
    answer: 'The market visit includes transportation to and from the local market, a guided tour with our chef who explains different spices and ingredients, purchasing fresh ingredients for the class, cultural insights about Sri Lankan food shopping habits, and tips on selecting quality produce. You\'ll learn to identify exotic vegetables, understand spice quality, and experience authentic local market culture.',
    order: 3
  },
  {
    tag: 'cooking-class-sri-lanka',
    question: 'Can I recreate these dishes at home?',
    answer: 'Yes! We provide comprehensive recipe booklets with step-by-step instructions, photos, and cooking tips. We also offer guidance on ingredient substitutions for items that may be hard to find in your home country. Many students successfully recreate our dishes at home. We even provide a small spice pack to get you started and offer online support for any questions after your class.',
    order: 4
  },
  {
    tag: 'cooking-class-sri-lanka',
    question: 'How many dishes will I learn to cook?',
    answer: 'The number varies by class type: Essential classes cover 5 main dishes, Master Chef sessions include 8-10 dishes, Family classes focus on 3-4 simple recipes, and private classes can be customized. All classes include main dishes, accompaniments like sambols, and often a dessert. You\'ll get hands-on experience with each dish and taste everything you prepare.',
    order: 5
  },
  {
    tag: 'cooking-class-sri-lanka',
    question: 'What should I bring to the cooking class?',
    answer: 'Just bring yourself and an appetite! We provide all cooking equipment, ingredients, aprons, and recipe materials. You might want to bring a camera to capture the experience, a small container if you\'d like to take leftovers (though most people finish their delicious creations!), and comfortable shoes as you\'ll be standing during cooking. Everything else is included.',
    order: 6
  }
];

async function seedCookingClassData() {
  try {
    console.log('🍛 Starting cooking class data seeding...');

    // 1. Seed the main experience document
    console.log('📝 Creating cooking class experience document...');
    await setDoc(doc(db, 'experiences', 'cooking-class-sri-lanka'), cookingClassData);
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

    console.log('🎉 All cooking class data seeded successfully!');
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
seedCookingClassData().then(() => {
  console.log('🏁 Seeding complete!');
  process.exit(0);
});