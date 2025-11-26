import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDPdd70zqKHG8pHbWYb9rGLmPkPJSxCPZU",
  authDomain: "new-recharge-travels-snc.firebaseapp.com",
  projectId: "new-recharge-travels-snc",
  storageBucket: "new-recharge-travels-snc.firebasestorage.app",
  messagingSenderId: "420853909018",
  appId: "1:420853909018:web:9be36f63b1ac09fd21c72d",
  measurementId: "G-NVTLV31S3Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const sriLankanExperiences = [
  {
    title: 'Hot Air Balloon over Sigiriya',
    slug: 'hot-air-balloon-sigiriya',
    category: 'adventure-expeditions',
    shortDescription: 'Float above the legendary Sigiriya Rock Fortress at sunrise, witnessing ancient wonders from the skies.',
    longDescription: `Experience Sri Lanka's most iconic UNESCO World Heritage Site from a unique perspective. As the sun rises over the ancient kingdom, you'll float peacefully above Sigiriya Rock Fortress in a luxury hot air balloon.

Your journey begins before dawn with champagne and light refreshments. As you ascend, witness the rock fortress emerge from the morning mist, surrounded by lush jungle and ancient water gardens. Your expert pilot will provide fascinating insights into the history and geology of the region.

After landing, enjoy a gourmet champagne breakfast at a scenic location, followed by a certificate ceremony commemorating your flight. This is truly a once-in-a-lifetime experience combining luxury, adventure, and Sri Lankan heritage.`,
    heroImage: 'https://images.unsplash.com/photo-1520483601560-4b97c8547dd2?w=1920',
    gallery: [
      { url: 'https://images.unsplash.com/photo-1520483601560-4b97c8547dd2?w=800', caption: 'Sunrise balloon flight over Sigiriya' },
      { url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800', caption: 'View of the ancient rock fortress' },
      { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', caption: 'Champagne breakfast celebration' }
    ],
    duration: '3-4 hours',
    groupSize: 'Up to 8 guests',
    priceFrom: 375,
    priceUnit: 'per person',
    included: [
      'Private hot air balloon flight',
      'Experienced pilot and crew',
      'Pre-flight champagne and refreshments',
      'Post-flight gourmet breakfast',
      'Flight certificate',
      'Professional photography',
      'Hotel pickup and drop-off'
    ],
    excluded: [
      'Entrance fee to Sigiriya Rock (if climbing)',
      'Personal expenses',
      'Travel insurance'
    ],
    locations: [
      { name: 'Sigiriya', latitude: 7.9570, longitude: 80.7603, description: 'Launch site near the ancient rock fortress' }
    ],
    highlights: [
      'UNESCO World Heritage Site views',
      'Sunrise flight experience',
      'Champagne breakfast',
      'Professional photography included',
      'Expert pilot commentary',
      'Flight certificate'
    ],
    bestTimeToVisit: 'November to April (dry season with clear skies)',
    difficultyLevel: 'easy',
    physicalRequirements: 'Moderate fitness required. Not suitable for pregnant women or those with serious medical conditions.',
    whatToBring: ['Comfortable clothing', 'Sunglasses', 'Sunscreen', 'Camera', 'Light jacket for early morning'],
    cancellationPolicy: 'Free cancellation up to 48 hours before departure. Flights are weather-dependent.',
    status: 'published',
    featured: true,
    popular: true,
    new: false
  },
  {
    title: 'Ceylon Tea Trails Experience',
    slug: 'tea-trails',
    category: 'cultural-immersion',
    shortDescription: 'Stay in restored colonial tea planter bungalows and immerse yourself in Ceylon tea heritage.',
    longDescription: `Step back in time to the golden age of Ceylon tea with an exclusive stay in meticulously restored tea planter bungalows in the heart of Nuwara Eliya's tea country.

Your experience includes accommodation in luxurious heritage bungalows, each uniquely decorated with period furniture and modern amenities. Wake up to misty mountain views and the aroma of freshly brewed Ceylon tea delivered to your room.

Explore verdant tea estates with expert tea planters, learn the art of tea plucking, visit the factory to witness tea processing, and enjoy exclusive tea tasting sessions with master blenders. Take leisurely walks through rolling hills, dine on gourmet cuisine prepared by your personal chef, and relax with traditional butler service.

This is an authentic immersion into Sri Lanka's tea heritage, combining luxury, history, and the serene beauty of the hill country.`,
    heroImage: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=1920',
    gallery: [
      { url: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800', caption: 'Heritage tea bungalow' },
      { url: 'https://images.unsplash.com/photo-1545665277-5937489579f2?w=800', caption: 'Tea plantation walks' },
      { url: 'https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?w=800', caption: 'Tea tasting session' }
    ],
    duration: '2-3 days',
    groupSize: 'Intimate groups (2-8 guests)',
    priceFrom: 450,
    priceUnit: 'per person per night',
    included: [
      'Luxury heritage bungalow accommodation',
      'All meals and beverages',
      'Personal butler service',
      'Guided tea estate tours',
      'Tea plucking experience',
      'Factory visits and tea tastings',
      'Transportation within estate'
    ],
    excluded: [
      'Transportation to/from Nuwara Eliya',
      'Alcoholic beverages (available for purchase)',
      'Personal expenses',
      'Travel insurance'
    ],
    locations: [
      { name: 'Nuwara Eliya', latitude: 6.9497, longitude: 80.7891, description: 'Ceylon tea country in the central highlands' }
    ],
    highlights: [
      'Stay in colonial tea planter bungalows',
      'Private tea estate tours',
      'Tea plucking and tasting experiences',
      'Personal butler service',
      'Gourmet meals with tea-infused cuisine',
      'Scenic hill country walks'
    ],
    bestTimeToVisit: 'Year-round, each season offers unique experiences',
    difficultyLevel: 'easy',
    physicalRequirements: 'Minimal. Suitable for all fitness levels. Estate walks are optional.',
    whatToBring: ['Warm clothing for cool evenings', 'Walking shoes', 'Camera', 'Rain jacket'],
    cancellationPolicy: 'Free cancellation up to 7 days before check-in. 50% refund for 3-7 days notice.',
    status: 'published',
    featured: true,
    popular: true,
    new: false
  },
  {
    title: 'Private Island Getaway',
    slug: 'island-getaways',
    category: 'romantic-escapes',
    shortDescription: 'Escape to exclusive private islands off Sri Lanka\'s coast with luxury villas and complete seclusion.',
    longDescription: `Discover the ultimate tropical escape on your own private island off Sri Lanka's stunning coastline. This exclusive experience offers complete privacy and luxury in an untouched paradise setting.

Your private island features luxury villas with panoramic ocean views, private beaches, and personalized service from a dedicated team including a private chef, butler, and activities coordinator.

Days are yours to design: snorkel in crystal-clear waters teeming with tropical fish, kayak through mangrove forests, enjoy water sports, or simply relax on pristine white sand beaches. Your personal chef prepares gourmet meals featuring fresh seafood and local specialties, served wherever you wish - on the beach, in the villa, or on a floating pontoon at sunset.

Perfect for romantic getaways, family reunions, or intimate celebrations, this is privacy and luxury at its finest.`,
    heroImage: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920',
    gallery: [
      { url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800', caption: 'Private island aerial view' },
      { url: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800', caption: 'Luxury beach villa' },
      { url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800', caption: 'Private beach dining' }
    ],
    duration: '2-7 days',
    groupSize: 'Up to 12 guests',
    priceFrom: 2500,
    priceUnit: 'per night (island rental)',
    included: [
      'Exclusive island rental',
      'Luxury villa accommodation',
      'Personal chef and all meals',
      'Butler and housekeeping service',
      'Non-motorized water sports',
      'Snorkeling equipment',
      'Kayaks and paddleboards',
      'Boat transfers'
    ],
    excluded: [
      'Motorized water sports',
      'Scuba diving (can be arranged)',
      'Alcoholic beverages',
      'Spa treatments',
      'Helicopter transfers',
      'Travel insurance'
    ],
    locations: [
      { name: 'Private Island, South Coast', latitude: 6.0329, longitude: 80.2168, description: 'Exclusive island near Galle' }
    ],
    highlights: [
      'Complete privacy on your own island',
      'Luxury villa with ocean views',
      'Personal chef and butler service',
      'Pristine beaches and coral reefs',
      'Water sports and activities',
      'Romantic dining experiences'
    ],
    bestTimeToVisit: 'November to April (calm seas and sunny weather)',
    difficultyLevel: 'easy',
    physicalRequirements: 'None. Suitable for all ages and fitness levels.',
    whatToBring: ['Swimwear', 'Sun protection', 'Beach wear', 'Camera', 'Underwater camera'],
    cancellationPolicy: 'Free cancellation up to 14 days. 50% refund for 7-14 days notice.',
    status: 'published',
    featured: true,
    popular: false,
    new: true
  },
  {
    title: 'Luxury Wildlife Safari - Yala & Wilpattu',
    slug: 'luxury-wildlife-safari',
    category: 'luxury-safari',
    shortDescription: 'Private game drives in Sri Lanka\'s premier parks with encounters with leopards, elephants, and sloth bears.',
    longDescription: `Embark on an extraordinary wildlife adventure through Sri Lanka's most renowned national parks - Yala and Wilpattu - home to one of the world's highest leopard densities.

Your luxury safari features private game drives in custom-designed 4x4 vehicles with expert naturalist guides who know every corner of these parks. Stay in exclusive tented camps that blend luxury with nature - think four-poster beds, ensuite bathrooms, gourmet dining, and sundowner cocktails overlooking waterholes.

Track the elusive Sri Lankan leopard, observe elephants at play, spot sloth bears foraging, and witness hundreds of bird species. Your days begin before dawn for the best wildlife viewing, return to camp for breakfast and rest during the heat, then venture out again for afternoon drives that extend into the magical golden hour.

Experience includes bush dining under the stars, photography guidance, and the thrill of encountering wildlife in their natural habitat - all with five-star comfort.`,
    heroImage: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?w=1920',
    gallery: [
      { url: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?w=800', caption: 'Sri Lankan leopard in Yala' },
      { url: 'https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=800', caption: 'Elephant herd' },
      { url: 'https://images.unsplash.com/photo-1484406566174-9da000fda645?w=800', caption: 'Luxury safari camp' }
    ],
    duration: '2-3 days',
    groupSize: 'Up to 6 guests per vehicle',
    priceFrom: 550,
    priceUnit: 'per person per night',
    included: [
      'Luxury tented camp accommodation',
      'All meals and beverages',
      'Private 4x4 safari vehicle',
      'Expert naturalist guide',
      'Park entrance fees',
      'Dawn and evening game drives',
      'Bush dining experience',
      'Photography guidance'
    ],
    excluded: [
      'Transportation to/from parks',
      'Alcoholic beverages',
      'Tips and gratuities',
      'Travel insurance'
    ],
    locations: [
      { name: 'Yala National Park', latitude: 6.3690, longitude: 81.5207, description: 'Sri Lanka\'s most famous leopard territory' },
      { name: 'Wilpattu National Park', latitude: 8.5283, longitude: 80.0297, description: 'Sri Lanka\'s largest national park' }
    ],
    highlights: [
      'Highest leopard density in the world',
      'Private luxury safari vehicles',
      'Expert naturalist guides',
      'Luxury tented camps',
      'Bush dining under stars',
      'Dawn and dusk game drives',
      'Photography opportunities'
    ],
    bestTimeToVisit: 'February to July for Yala; August to October for Wilpattu',
    difficultyLevel: 'easy',
    physicalRequirements: 'Minimal. Early morning starts required. Suitable for most fitness levels.',
    whatToBring: ['Neutral-colored clothing', 'Binoculars', 'Camera with telephoto lens', 'Sunscreen', 'Hat', 'Insect repellent'],
    cancellationPolicy: 'Free cancellation up to 7 days. 50% refund for 3-7 days notice.',
    status: 'published',
    featured: true,
    popular: true,
    new: false
  },
  {
    title: 'Sri Lankan Culinary Masterclass',
    slug: 'cooking-class-sri-lanka',
    category: 'culinary-journeys',
    shortDescription: 'Master authentic Sri Lankan cuisine with celebrity chefs and explore organic spice gardens.',
    longDescription: `Embark on a gastronomic journey through Sri Lanka's rich culinary heritage with celebrity chefs and spice experts. This immersive experience takes you from spice gardens to historic kitchens, unveiling the secrets of authentic Sri Lankan cuisine.

Begin your day with a visit to an organic spice garden in Matale, where you'll learn about cardamom, cinnamon, pepper, cloves, and other spices that make Sri Lankan food unique. Your expert guide explains traditional uses and medicinal properties.

Then, join a renowned Sri Lankan chef in a colonial-era kitchen for hands-on cooking classes. Learn to prepare traditional rice and curry, hoppers, kottu roti, and exotic curries using techniques passed down through generations. Master the art of tempering spices, grinding curry pastes on stone, and achieving the perfect coconut milk consistency.

Your experience culminates in a sumptuous feast in a heritage mansion, where you enjoy the fruits of your labor paired with Ceylon tea. Take home a personalized recipe book and newfound skills.`,
    heroImage: 'https://images.unsplash.com/photo-1596040033229-a0b7e0c1f99c?w=1920',
    gallery: [
      { url: 'https://images.unsplash.com/photo-1596040033229-a0b7e0c1f99c?w=800', caption: 'Cooking with celebrity chef' },
      { url: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800', caption: 'Spice garden tour' },
      { url: 'https://images.unsplash.com/photo-1589621316382-008455b857cd?w=800', caption: 'Traditional rice and curry' }
    ],
    duration: '6 hours (full day experience)',
    groupSize: 'Up to 10 guests',
    priceFrom: 185,
    priceUnit: 'per person',
    included: [
      'Celebrity chef instruction',
      'Organic spice garden tour',
      'All ingredients and equipment',
      'Hands-on cooking session',
      'Gourmet lunch featuring your dishes',
      'Ceylon tea pairing',
      'Personalized recipe book',
      'Transportation from Colombo/Kandy'
    ],
    excluded: [
      'Hotel pickup from other cities',
      'Alcoholic beverages',
      'Personal expenses',
      'Travel insurance'
    ],
    locations: [
      { name: 'Matale', latitude: 7.4675, longitude: 80.6234, description: 'Spice garden region' },
      { name: 'Kandy', latitude: 7.2906, longitude: 80.6337, description: 'Colonial heritage kitchen' }
    ],
    highlights: [
      'Celebrity chef instruction',
      'Organic spice garden visit',
      'Hands-on cooking in colonial kitchen',
      'Traditional stone grinding techniques',
      'Learn authentic family recipes',
      'Gourmet dining experience',
      'Take home recipe book'
    ],
    bestTimeToVisit: 'Year-round availability',
    difficultyLevel: 'easy',
    physicalRequirements: 'Minimal. Some standing required during cooking. Suitable for all ages.',
    whatToBring: ['Comfortable clothing', 'Apron provided', 'Camera', 'Appetite!'],
    cancellationPolicy: 'Free cancellation up to 24 hours before class. 50% refund within 24 hours.',
    status: 'published',
    featured: true,
    popular: true,
    new: false
  },
  {
    title: 'Blue Whale & Dolphin Watching - Mirissa',
    slug: 'whale-watching',
    category: 'marine-adventures',
    shortDescription: 'Encounter majestic blue whales and playful dolphins off Mirissa coast with marine biologists.',
    longDescription: `Experience one of the world's best whale watching destinations with a luxury boat expedition off the coast of Mirissa. Sri Lanka's southern waters are home to blue whales, sperm whales, and several dolphin species year-round.

Your adventure begins before dawn at Mirissa harbor, where you'll board a spacious luxury boat equipped with comfortable seating, shade, restrooms, and observation decks. Accompanied by experienced marine biologists, you'll cruise into deep waters where these magnificent creatures feed and play.

Witness the awe-inspiring sight of blue whales - the largest animals on Earth - surfacing beside your boat. Watch spinner dolphins perform acrobatic displays, and spot sperm whales diving into the depths. Your marine biologist provides fascinating insights into whale behavior, conservation efforts, and marine ecology.

Enjoy a gourmet breakfast at sea with fresh tropical fruits, pastries, and beverages. Professional photographers on board capture your encounter, and hydrophones allow you to hear the whales' haunting songs. This is nature at its most spectacular.`,
    heroImage: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920',
    gallery: [
      { url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800', caption: 'Blue whale encounter' },
      { url: 'https://images.unsplash.com/photo-1584714268709-c3dd9c92b378?w=800', caption: 'Dolphin pod' },
      { url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800', caption: 'Luxury whale watching boat' }
    ],
    duration: '4-5 hours',
    groupSize: 'Small groups (maximum 20 guests)',
    priceFrom: 125,
    priceUnit: 'per person',
    included: [
      'Luxury boat with comfortable seating',
      'Expert marine biologist guide',
      'Gourmet breakfast at sea',
      'Fresh fruits and beverages',
      'Life jackets and safety equipment',
      'Underwater microphone (hydrophone)',
      'Professional photography service',
      'Hotel pickup from Mirissa/Weligama'
    ],
    excluded: [
      'Hotel pickup from other areas',
      'Seasickness medication (recommended to bring)',
      'Personal expenses',
      'Travel insurance'
    ],
    locations: [
      { name: 'Mirissa', latitude: 5.9467, longitude: 80.4721, description: 'Premier whale watching destination' }
    ],
    highlights: [
      'Blue whale encounters',
      'Dolphin watching',
      'Marine biologist expertise',
      'Gourmet breakfast at sea',
      'Hydrophone whale song listening',
      'Professional photography',
      'Luxury boat experience'
    ],
    bestTimeToVisit: 'November to April for best conditions',
    difficultyLevel: 'easy',
    physicalRequirements: 'None. Suitable for all ages. Seas can be rough - not recommended for those prone to seasickness.',
    whatToBring: ['Sunscreen', 'Sunglasses', 'Hat', 'Camera', 'Light jacket', 'Seasickness medication if needed'],
    cancellationPolicy: 'Free cancellation up to 24 hours. Weather-dependent - full refund if trip cancelled due to conditions.',
    status: 'published',
    featured: true,
    popular: true,
    new: false
  }
];

async function seedExperiences() {
  console.log('🌴 Starting to seed Sri Lankan Luxury Experiences...\n');

  const experiencesCollection = collection(db, 'luxuryExperiences');
  let successCount = 0;
  let errorCount = 0;

  for (const experience of sriLankanExperiences) {
    try {
      const experienceData = {
        ...experience,
        publishedAt: Timestamp.now(),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const docRef = await addDoc(experiencesCollection, experienceData);
      console.log(`✅ Added: ${experience.title} (ID: ${docRef.id})`);
      successCount++;
    } catch (error) {
      console.error(`❌ Error adding ${experience.title}:`, error);
      errorCount++;
    }
  }

  console.log('\n📊 Seeding Summary:');
  console.log(`   ✅ Successfully added: ${successCount} experiences`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log('\n🎉 Seeding complete!');
}

// Run the seed function
seedExperiences()
  .then(() => {
    console.log('\n✨ All done! You can now view experiences at /experiences');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });
