import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, addDoc } from 'firebase/firestore';
import islandGetawaysData from '../src/data/seed-island-getaways.json';

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

// Sample tours data for island getaways
const sampleTours = [
  {
    experienceSlug: 'island-getaways',
    title: 'Delft Island Wild Pony Safari',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Fdelft-pony-tour.webp?alt=media',
    badges: ['Unique Wildlife', 'Day Trip'],
    duration: '1 day',
    salePriceUSD: 125,
    regularPriceUSD: 150,
    isPublished: true,
    description: 'Track wild ponies, explore ancient baobab trees and Dutch colonial ruins on remote Delft Island.',
    highlights: [
      'Ferry crossing from Kurikadduwan jetty',
      'Wild pony tracking with local guide',
      'Visit growing stone and ancient baobab',
      'Traditional island lunch included'
    ]
  },
  {
    experienceSlug: 'island-getaways',
    title: 'Kayts Coral Reef Snorkeling Adventure',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Fkayts-snorkel-tour.webp?alt=media',
    badges: ['Snorkeling', 'Marine Life'],
    duration: '6 hours',
    salePriceUSD: 85,
    regularPriceUSD: 100,
    isPublished: true,
    description: 'Discover vibrant coral gardens and WWII shipwrecks in the crystal-clear waters around Kayts.',
    highlights: [
      'Professional snorkeling equipment provided',
      'Marine biologist guide',
      'Visit 3 different reef sites',
      'Beach BBQ lunch on secluded shore'
    ]
  },
  {
    experienceSlug: 'island-getaways',
    title: 'Mannar Sandbank Picnic Escape',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Fmannar-sandbank-tour.webp?alt=media',
    badges: ['Exclusive', 'Beach Paradise'],
    duration: '5 hours',
    salePriceUSD: 95,
    regularPriceUSD: 120,
    isPublished: true,
    description: 'Boat to pristine sandbanks emerging from turquoise waters for the ultimate castaway experience.',
    highlights: [
      'Private speedboat charter',
      'Gourmet beach picnic setup',
      'Flamingo and migratory bird watching',
      'Sunset photography opportunity'
    ]
  },
  {
    experienceSlug: 'island-getaways',
    title: 'Northern Islands Multi-Day Explorer',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Fnorthern-islands-tour.webp?alt=media',
    badges: ['Multi-Day', 'All-Inclusive'],
    duration: '3 days / 2 nights',
    salePriceUSD: 385,
    regularPriceUSD: 480,
    isPublished: true,
    description: 'Comprehensive island-hopping journey covering Delft, Nainativu, and Mannar archipelago.',
    highlights: [
      'Visit 5 different islands',
      'Boutique guesthouse accommodations',
      'All meals and boat transfers included',
      'Cultural immersion with fishing communities'
    ]
  },
  {
    experienceSlug: 'island-getaways',
    title: 'Jaffna Lagoon Kayaking & Island Picnic',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Fjaffna-kayak-tour.webp?alt=media',
    badges: ['Active', 'Eco-Friendly'],
    duration: '4 hours',
    salePriceUSD: 65,
    isPublished: true,
    description: 'Paddle through mangrove channels to reach uninhabited islands perfect for bird watching.',
    highlights: [
      'Professional kayaking equipment',
      'Mangrove ecosystem exploration',
      'Deserted island beach time',
      'Light refreshments and fruits'
    ]
  },
  {
    experienceSlug: 'island-getaways',
    title: 'Luxury Catamaran Island Safari',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/recharge-travels-73e76.appspot.com/o/tours%2Fluxury-catamaran-tour.webp?alt=media',
    badges: ['Luxury', 'Private Charter'],
    duration: '8 hours',
    salePriceUSD: 295,
    regularPriceUSD: 350,
    isPublished: true,
    description: 'Premium island-hopping experience aboard a luxury catamaran with gourmet dining.',
    highlights: [
      'Luxury 40ft catamaran charter',
      'Professional crew and chef',
      'Multiple swimming and snorkeling stops',
      'Premium wines and cocktails included'
    ]
  }
];

// Sample FAQs for island getaways
const sampleFAQs = [
  {
    tag: 'island-getaways',
    question: 'What is the best time to visit the northern islands of Sri Lanka?',
    answer: 'The ideal time is from May to September when the seas are calmest and weather is dry. However, island trips are possible year-round with some seasonal adjustments. December to March can have rougher seas but offers excellent bird watching as migratory species arrive. Always check weather conditions before booking.',
    order: 1
  },
  {
    tag: 'island-getaways',
    question: 'How do I reach the islands from mainland Sri Lanka?',
    answer: 'Access varies by island. Delft and Nainativu are reached via public ferry from Kurikadduwan jetty (near Jaffna). Kayts connects via causeway and boat. Mannar islands require private boat arrangements. We handle all logistics including mainland transfers, ferry tickets, and private boat charters. The journey is part of the adventure!',
    order: 2
  },
  {
    tag: 'island-getaways',
    question: 'Are the island tours suitable for families with children?',
    answer: 'Yes, most island tours are family-friendly, especially the shorter day trips. Children love spotting wild ponies on Delft and playing on sandbanks. We provide child-sized life jackets and can arrange shorter itineraries. For very young children (under 5), we recommend calm-weather days and closer islands like Kayts.',
    order: 3
  },
  {
    tag: 'island-getaways',
    question: 'What should I bring for an island getaway tour?',
    answer: 'Essential items include sunscreen (reef-safe preferred), hat, sunglasses, swimwear, quick-dry clothing, water shoes (coral areas), camera in waterproof case, and any personal medications. We provide snorkeling gear, life jackets, and beach umbrellas. For overnight trips, pack light as boat space is limited.',
    order: 4
  },
  {
    tag: 'island-getaways',
    question: 'Can I see the famous wild ponies of Delft Island?',
    answer: 'Yes! Delft Island hosts Sri Lanka\'s only population of feral ponies, descendants of horses brought by Portuguese colonizers. Sightings are common but not guaranteed as they roam freely across the island. Early morning and late afternoon offer best chances. Our local guides know their favorite grazing spots.',
    order: 5
  },
  {
    tag: 'island-getaways',
    question: 'Are there accommodation options on the islands?',
    answer: 'Accommodation is limited but authentic. Delft has basic guesthouses run by local families. Mannar has more options including eco-lodges. Most visitors prefer day trips or stay in Jaffna/Mannar town. For overnight island stays, we arrange the best available local accommodations with advance booking.',
    order: 6
  }
];

async function seedIslandGetawaysData() {
  try {
    console.log('🏝️ Starting island getaways data seeding...');

    // 1. Seed the main experience document
    console.log('📝 Creating island getaways experience document...');
    await setDoc(doc(db, 'experiences', 'island-getaways'), islandGetawaysData);
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

    console.log('🎉 All island getaways data seeded successfully!');
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
seedIslandGetawaysData().then(() => {
  console.log('🏁 Seeding complete!');
  process.exit(0);
});