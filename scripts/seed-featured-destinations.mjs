// Seed Featured Destinations to Firebase
// Run with: node scripts/seed-featured-destinations.mjs

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, Timestamp, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAl-WP0HWyXAd2INQQ59M22g3D6PtIv7Hg",
  authDomain: "recharge-travels-73e76.firebaseapp.com",
  projectId: "recharge-travels-73e76",
  storageBucket: "recharge-travels-73e76.firebasestorage.app",
  messagingSenderId: "776135377498",
  appId: "1:776135377498:web:06fa6e6a64bd08a1f5adad"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const FEATURED_DESTINATIONS = [
  {
    name: 'Sigiriya',
    title: 'Lion Rock Fortress',
    category: 'UNESCO Heritage',
    description: 'Ancient rock fortress rising 200m above jungle. UNESCO World Heritage site with stunning frescoes and panoramic views.',
    image: 'https://images.unsplash.com/photo-1586523969943-2d62a1a7d4d3?w=800&q=80',
    price: 150,
    currency: 'USD',
    duration: 'Full Day Trip',
    rating: 4.9,
    features: ['Ancient Frescoes', 'Mirror Wall', 'Lion Gate', 'Water Gardens'],
    link: '/destinations/sigiriya',
    bestTimeToVisit: 'Year-round, best from December to April',
    popularActivities: ['Sunrise climb', 'Fresco viewing', 'Fortress walk', 'Village tour'],
    isActive: true,
    isFeatured: true,
    order: 1,
  },
  {
    name: 'Ella',
    title: 'Hill Country Paradise',
    category: 'Hill Country',
    description: 'Misty mountain town famous for Nine Arch Bridge, scenic train rides, and incredible hiking trails through tea country.',
    image: 'https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?w=800&q=80',
    price: 180,
    currency: 'USD',
    duration: '2 Days / 1 Night',
    rating: 4.8,
    features: ['Nine Arch Bridge', 'Ella Rock', 'Tea Plantations', 'Ravana Falls'],
    link: '/destinations/ella',
    bestTimeToVisit: 'February to April',
    popularActivities: ['Scenic train ride', 'Ella Rock hike', "Little Adam's Peak", 'Tea factory tour'],
    isActive: true,
    isFeatured: true,
    order: 2,
  },
  {
    name: 'Kandy',
    title: 'Temple of Sacred Tooth',
    category: 'Cultural Heritage',
    description: "Sri Lanka's cultural capital housing Buddha's sacred tooth relic. Experience traditional dance and lakeside serenity.",
    image: 'https://images.unsplash.com/photo-1580181046391-e7e83f206c62?w=800&q=80',
    price: 130,
    currency: 'USD',
    duration: 'Full Day Trip',
    rating: 4.7,
    features: ['Temple of Tooth', 'Kandy Lake', 'Cultural Dance', 'Royal Palace'],
    link: '/destinations/kandy',
    bestTimeToVisit: 'July to August for Esala Perahera',
    popularActivities: ['Temple visit', 'Lake walk', 'Cultural show', 'Botanical gardens'],
    isActive: true,
    isFeatured: true,
    order: 3,
  },
  {
    name: 'Galle',
    title: 'Dutch Colonial Fort',
    category: 'Colonial Heritage',
    description: 'Historic UNESCO fort city with stunning Dutch colonial architecture, cobblestone streets, and ocean sunset views.',
    image: 'https://images.unsplash.com/photo-1588598198321-9735fd52045b?w=800&q=80',
    price: 140,
    currency: 'USD',
    duration: 'Full Day Trip',
    rating: 4.8,
    features: ['Galle Fort', 'Lighthouse', 'Dutch Museum', 'Rampart Walks'],
    link: '/destinations/galle',
    bestTimeToVisit: 'December to April',
    popularActivities: ['Fort walk', 'Sunset views', 'Cafe hopping', 'Art galleries'],
    isActive: true,
    isFeatured: true,
    order: 4,
  },
  {
    name: 'Mirissa',
    title: 'Whale Watching Capital',
    category: 'Beach',
    description: 'World-renowned blue whale watching destination with pristine beaches, palm-fringed shores, and laid-back vibes.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    price: 120,
    currency: 'USD',
    duration: 'Full Day Trip',
    rating: 4.6,
    features: ['Blue Whales', 'Secret Beach', 'Coconut Tree Hill', 'Surfing'],
    link: '/destinations/mirissa',
    bestTimeToVisit: 'November to April',
    popularActivities: ['Whale watching', 'Beach relaxation', 'Snorkeling', 'Sunset yoga'],
    isActive: true,
    isFeatured: true,
    order: 5,
  },
  {
    name: 'Yala National Park',
    title: 'Wildlife Safari Paradise',
    category: 'Wildlife',
    description: "Home to the world's highest leopard density. Experience thrilling jeep safaris through diverse ecosystems.",
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80',
    price: 200,
    currency: 'USD',
    duration: 'Full Day Safari',
    rating: 4.9,
    features: ['Leopards', 'Elephants', 'Crocodiles', 'Bird Watching'],
    link: '/experiences/wildlife-safari',
    bestTimeToVisit: 'February to July',
    popularActivities: ['Morning safari', 'Evening safari', 'Bird watching', 'Photography'],
    isActive: true,
    isFeatured: true,
    order: 6,
  },
  {
    name: 'Nuwara Eliya',
    title: 'Little England',
    category: 'Hill Country',
    description: 'Colonial hill station with cool climate, misty mountains, strawberry farms, and endless tea estates.',
    image: 'https://images.unsplash.com/photo-1571536802807-30451e3f3d43?w=800&q=80',
    price: 160,
    currency: 'USD',
    duration: '2 Days / 1 Night',
    rating: 4.5,
    features: ['Tea Estates', 'Gregory Lake', 'Horton Plains', 'Strawberry Farms'],
    link: '/destinations/nuwara-eliya',
    bestTimeToVisit: 'April for New Year celebrations',
    popularActivities: ["World's End trek", 'Tea tasting', 'Boat ride', 'Golf'],
    isActive: true,
    isFeatured: true,
    order: 7,
  },
  {
    name: 'Anuradhapura',
    title: 'Ancient Kingdom',
    category: 'UNESCO Heritage',
    description: 'Sacred ancient city with 2,500 years of Buddhist heritage. Home to the sacred Sri Maha Bodhi tree.',
    image: 'https://images.unsplash.com/photo-1588598198321-39f8c2be97ba?w=800&q=80',
    price: 145,
    currency: 'USD',
    duration: 'Full Day Trip',
    rating: 4.7,
    features: ['Sri Maha Bodhi', 'Ruwanwelisaya', 'Ancient Ruins', 'Moonstone'],
    link: '/destinations/anuradhapura',
    bestTimeToVisit: 'Year-round',
    popularActivities: ['Temple circuit', 'Cycling tour', 'Sunset at stupa', 'Meditation'],
    isActive: true,
    isFeatured: true,
    order: 8,
  },
  {
    name: 'Trincomalee',
    title: 'Eastern Paradise',
    category: 'Beach',
    description: 'Pristine eastern beaches with natural harbor, Hindu temples, and world-class diving at Pigeon Island.',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
    price: 170,
    currency: 'USD',
    duration: '2 Days / 1 Night',
    rating: 4.6,
    features: ['Pigeon Island', 'Nilaveli Beach', 'Koneswaram Temple', 'Hot Springs'],
    link: '/destinations/trincomalee',
    bestTimeToVisit: 'April to September',
    popularActivities: ['Snorkeling', 'Beach hopping', 'Temple visit', 'Whale watching'],
    isActive: true,
    isFeatured: true,
    order: 9,
  },
  {
    name: 'Jaffna',
    title: 'Northern Heritage',
    category: 'Culture',
    description: 'Vibrant Tamil culture, ancient Hindu temples, unique cuisine, and resilient spirit of the north.',
    image: 'https://images.unsplash.com/photo-1588598198321-39f8c2be97ba?w=800&q=80',
    price: 190,
    currency: 'USD',
    duration: '2 Days / 1 Night',
    rating: 4.5,
    features: ['Nallur Temple', 'Jaffna Fort', 'Islands', 'Tamil Cuisine'],
    link: '/destinations/jaffna',
    bestTimeToVisit: 'February to September',
    popularActivities: ['Temple hopping', 'Island exploration', 'Food tour', 'Fort visit'],
    isActive: true,
    isFeatured: true,
    order: 10,
  },
];

async function seedFeaturedDestinations() {
  console.log('Starting to seed featured destinations...');

  try {
    // Check for existing data
    const existingSnapshot = await getDocs(collection(db, 'featuredDestinations'));

    if (!existingSnapshot.empty) {
      console.log(`Found ${existingSnapshot.size} existing destinations.`);
      console.log('Clearing existing data first...');

      for (const doc of existingSnapshot.docs) {
        await deleteDoc(doc.ref);
      }
      console.log('Existing data cleared.');
    }

    // Add new destinations
    const timestamp = Timestamp.now();
    let count = 0;

    for (const dest of FEATURED_DESTINATIONS) {
      const data = {
        ...dest,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      await addDoc(collection(db, 'featuredDestinations'), data);
      count++;
      console.log(`Added: ${dest.name}`);
    }

    console.log(`\nSuccessfully seeded ${count} featured destinations!`);
    console.log('You can now see them in the admin panel.');

  } catch (error) {
    console.error('Error seeding destinations:', error);
  }

  process.exit(0);
}

seedFeaturedDestinations();
