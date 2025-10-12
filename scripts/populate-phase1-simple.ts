import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxFnQfMo3rOWhgm1_yiRIh0Oez246U2N0",
  authDomain: "recharge-travels-73e76.firebaseapp.com",
  projectId: "recharge-travels-73e76",
  storageBucket: "recharge-travels-73e76.firebasestorage.app",
  messagingSenderId: "515581447537",
  appId: "1:515581447537:web:b4f65bf9c2544c65d6fad0",
  measurementId: "G-W2MJBDFDG3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Phase 1 Pages Content
const phase1Pages = [
  // HOMEPAGE
  {
    id: 'home',
    slug: '/',
    title: 'Recharge Travels - Sri Lanka Tourism',
    metaTitle: 'Sri Lanka Tourism | Best Tours & Travel Packages | Recharge Travels',
    metaDescription: 'Discover Sri Lanka with Recharge Travels. Book cultural tours, wildlife safaris, beach holidays, and luxury experiences. Expert guides, custom packages, and unforgettable adventures.',
    metaKeywords: 'Sri Lanka tourism, Sri Lanka tours, cultural tours, wildlife safaris, beach holidays, luxury travel, Colombo, Kandy, Sigiriya, Ella, Galle',
    heroTitle: 'Discover the Magic of Sri Lanka',
    heroSubtitle: 'Experience Ancient Temples, Pristine Beaches & Wildlife Adventures',
    heroImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920',
    status: 'published',
    sections: [
      {
        id: 'hero-stats',
        type: 'stats',
        heading: 'Why Choose Sri Lanka',
        content: JSON.stringify([
          { value: '8', label: 'UNESCO Sites', desc: 'World heritage treasures' },
          { value: '1,340km', label: 'Coastline', desc: 'Pristine beaches' },
          { value: '3,000+', label: 'Endemic Species', desc: 'Biodiversity hotspot' },
          { value: '2,500+', label: 'Years of History', desc: 'Ancient civilization' }
        ]),
        order: 1
      },
      {
        id: 'main-content',
        type: 'text',
        heading: 'Welcome to Sri Lanka',
        content: '<p>Sri Lanka, the teardrop-shaped island in the Indian Ocean, offers an incredible diversity of experiences within its compact borders. From misty mountains and lush rainforests to golden beaches and ancient ruins, this tropical paradise has captivated travelers for centuries.</p><p>With a history spanning over 2,500 years, Sri Lanka boasts eight UNESCO World Heritage Sites, a rich cultural tapestry influenced by Buddhism, Hinduism, and colonial heritage, and some of the world\'s finest tea, spices, and gemstones.</p>',
        order: 2
      },
      {
        id: 'highlights',
        type: 'text',
        heading: 'What Makes Sri Lanka Special',
        content: '<ul><li><strong>Ancient Buddhist temples and stupas</strong> - Sacred sites of spiritual significance</li><li><strong>Pristine beaches and coral reefs</strong> - Perfect for swimming, surfing, and diving</li><li><strong>Misty tea plantations</strong> - Experience the world-famous Ceylon tea</li><li><strong>Wildlife safaris in national parks</strong> - Spot elephants, leopards, and exotic birds</li><li><strong>Spice gardens and plantations</strong> - Discover the origins of world-famous spices</li><li><strong>Colonial architecture</strong> - Portuguese, Dutch, and British influences</li><li><strong>Traditional Ayurvedic treatments</strong> - Ancient healing practices</li><li><strong>Adventure sports and activities</strong> - Hiking, rafting, and water sports</li></ul>',
        order: 3
      },
      {
        id: 'cta-section',
        type: 'cta',
        heading: 'Ready to Explore Sri Lanka?',
        content: 'Start planning your unforgettable journey to the Pearl of the Indian Ocean',
        order: 4,
        settings: {
          ctaButton: {
            text: 'Browse Our Tours',
            url: '/tours'
          }
        }
      }
    ]
  },

  // COLOMBO
  {
    id: 'colombo',
    slug: '/destinations/colombo',
    title: 'Colombo - Sri Lanka\'s Vibrant Capital',
    metaTitle: 'Colombo Travel Guide | Capital City of Sri Lanka | Recharge Travels',
    metaDescription: 'Explore Colombo, Sri Lanka\'s bustling capital city. Discover colonial architecture, modern shopping, cultural sites, and authentic cuisine. Plan your Colombo city tour.',
    metaKeywords: 'Colombo, Sri Lanka capital, Colombo travel, Colombo tourism, city tour, colonial architecture, shopping, restaurants',
    heroTitle: 'Colombo - Where Tradition Meets Modernity',
    heroSubtitle: 'Discover Sri Lanka\'s Vibrant Capital City',
    heroImage: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=1920',
    status: 'published',
    sections: [
      {
        id: 'colombo-intro',
        type: 'text',
        heading: 'Welcome to Colombo',
        content: '<p>Colombo, the commercial capital of Sri Lanka, is a vibrant metropolis that seamlessly blends the old with the new. This bustling port city offers visitors a fascinating mix of colonial architecture, modern skyscrapers, ancient temples, and bustling markets.</p><p>As the gateway to Sri Lanka, Colombo serves as the perfect introduction to the island\'s rich culture and heritage. From the historic Fort district to the modern shopping malls of the city center, Colombo has something to offer every type of traveler.</p>',
        order: 1
      },
      {
        id: 'colombo-attractions',
        type: 'text',
        heading: 'Top Attractions in Colombo',
        content: '<ul><li><strong>Gangaramaya Temple</strong> - One of Colombo\'s most important Buddhist temples</li><li><strong>Independence Memorial Hall</strong> - Commemorates Sri Lanka\'s independence from British rule</li><li><strong>Galle Face Green</strong> - Iconic oceanfront promenade and recreation area</li><li><strong>National Museum</strong> - Houses the country\'s largest collection of cultural artifacts</li><li><strong>Pettah Market</strong> - Bustling bazaar with everything from spices to electronics</li><li><strong>Mount Lavinia Beach</strong> - Popular beach destination near the city</li></ul>',
        order: 2
      },
      {
        id: 'colombo-culture',
        type: 'text',
        heading: 'Cultural Experiences',
        content: '<p>Colombo\'s cultural diversity is reflected in its religious sites, cuisine, and festivals. Visit the historic Jami Ul-Alfar Mosque, explore the vibrant street art scene, or sample authentic Sri Lankan cuisine at local restaurants and street food stalls.</p><p>The city\'s colonial heritage is evident in the architecture of buildings like the Old Parliament Building and the Cargills Building, while modern developments showcase Sri Lanka\'s progress and ambition.</p>',
        order: 3
      }
    ]
  },

  // KANDY
  {
    id: 'kandy',
    slug: '/destinations/kandy',
    title: 'Kandy - The Cultural Heart of Sri Lanka',
    metaTitle: 'Kandy Travel Guide | Cultural Capital & Temple of the Tooth | Recharge Travels',
    metaDescription: 'Visit Kandy, Sri Lanka\'s cultural capital. Explore the Temple of the Sacred Tooth Relic, Royal Botanical Gardens, and traditional dance performances. Book your Kandy tour.',
    metaKeywords: 'Kandy, Temple of the Tooth, cultural capital, Royal Botanical Gardens, traditional dance, Sri Lanka culture',
    heroTitle: 'Kandy - The Cultural Heart of Sri Lanka',
    heroSubtitle: 'Discover Ancient Traditions and Sacred Temples',
    heroImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920',
    status: 'published',
    sections: [
      {
        id: 'kandy-intro',
        type: 'text',
        heading: 'Welcome to Kandy',
        content: '<p>Kandy, the last capital of the ancient kings of Sri Lanka, is a UNESCO World Heritage Site and the cultural heart of the island. Nestled in the central highlands, this beautiful city is surrounded by lush hills and tea plantations.</p><p>Known for its rich cultural heritage, Kandy is home to the Temple of the Sacred Tooth Relic, one of the most sacred Buddhist sites in the world. The city\'s traditional architecture, vibrant festivals, and warm hospitality make it a must-visit destination.</p>',
        order: 1
      },
      {
        id: 'temple-of-tooth',
        type: 'text',
        heading: 'Temple of the Sacred Tooth Relic',
        content: '<p>The Temple of the Sacred Tooth Relic (Sri Dalada Maligawa) is the most important Buddhist temple in Sri Lanka. It houses the sacred tooth relic of Lord Buddha, which is believed to have been brought to Sri Lanka in the 4th century AD.</p><p>The temple complex features stunning architecture, intricate carvings, and beautiful murals. Visitors can witness daily ceremonies and rituals, and the temple is particularly spectacular during the annual Esala Perahera festival.</p>',
        order: 2
      },
      {
        id: 'kandy-attractions',
        type: 'text',
        heading: 'Other Attractions',
        content: '<ul><li><strong>Royal Botanical Gardens</strong> - One of the finest botanical gardens in Asia</li><li><strong>Kandy Lake</strong> - Artificial lake built by the last king of Kandy</li><li><strong>Traditional Dance Performances</strong> - Experience authentic Kandyan dance</li><li><strong>Tea Plantations</strong> - Visit nearby tea estates and factories</li><li><strong>Spice Gardens</strong> - Learn about Sri Lanka\'s famous spices</li></ul>',
        order: 3
      }
    ]
  },

  // GALLE
  {
    id: 'galle',
    slug: '/destinations/galle',
    title: 'Galle - Colonial Charm on the Southern Coast',
    metaTitle: 'Galle Travel Guide | Colonial Fort & Southern Beaches | Recharge Travels',
    metaDescription: 'Explore Galle, a UNESCO World Heritage Site with a historic Dutch fort, colonial architecture, and beautiful beaches. Plan your Galle Fort tour and southern coast adventure.',
    metaKeywords: 'Galle, Galle Fort, Dutch fort, colonial architecture, southern coast, beaches, UNESCO site',
    heroTitle: 'Galle - Colonial Charm on the Southern Coast',
    heroSubtitle: 'Explore the Historic Dutch Fort and Beautiful Beaches',
    heroImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920',
    status: 'published',
    sections: [
      {
        id: 'galle-intro',
        type: 'text',
        heading: 'Welcome to Galle',
        content: '<p>Galle, located on the southwestern tip of Sri Lanka, is a charming coastal city famous for its well-preserved Dutch fort. The Galle Fort, a UNESCO World Heritage Site, is one of the best-preserved colonial fortifications in Asia.</p><p>This historic city offers a perfect blend of colonial architecture, modern amenities, and natural beauty. The fort area is home to boutique hotels, art galleries, cafes, and restaurants, while the surrounding area features beautiful beaches and traditional fishing villages.</p>',
        order: 1
      },
      {
        id: 'galle-fort',
        type: 'text',
        heading: 'Galle Fort',
        content: '<p>The Galle Fort, built by the Dutch in the 17th century, is a living monument to colonial history. The fort\'s massive walls, bastions, and ramparts have withstood the test of time and natural disasters, including the 2004 tsunami.</p><p>Inside the fort, visitors can explore narrow cobblestone streets lined with colonial-era buildings, visit the historic Dutch Reformed Church, climb the lighthouse for panoramic views, and enjoy the relaxed atmosphere of this unique heritage site.</p>',
        order: 2
      },
      {
        id: 'galle-beaches',
        type: 'text',
        heading: 'Beautiful Beaches',
        content: '<p>Galle is surrounded by some of Sri Lanka\'s most beautiful beaches. Unawatuna Beach, just a short distance from the fort, is famous for its crescent-shaped bay and clear waters. Nearby beaches like Jungle Beach and Dalawella Beach offer more secluded spots for swimming and relaxation.</p><p>The area is also popular for water sports, including surfing, snorkeling, and diving. The coral reefs off the coast provide excellent opportunities for underwater exploration.</p>',
        order: 3
      }
    ]
  },

  // SIGIRIYA
  {
    id: 'sigiriya',
    slug: '/destinations/sigiriya',
    title: 'Sigiriya - The Ancient Rock Fortress',
    metaTitle: 'Sigiriya Travel Guide | Ancient Rock Fortress & UNESCO Site | Recharge Travels',
    metaDescription: 'Climb Sigiriya, the ancient rock fortress and UNESCO World Heritage Site. Discover ancient frescoes, gardens, and breathtaking views. Book your Sigiriya tour.',
    metaKeywords: 'Sigiriya, rock fortress, ancient palace, frescoes, UNESCO site, cultural triangle',
    heroTitle: 'Sigiriya - The Ancient Rock Fortress',
    heroSubtitle: 'Climb the Eighth Wonder of the World',
    heroImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920',
    status: 'published',
    sections: [
      {
        id: 'sigiriya-intro',
        type: 'text',
        heading: 'Welcome to Sigiriya',
        content: '<p>Sigiriya, often called the "Eighth Wonder of the World," is one of Sri Lanka\'s most iconic landmarks. This ancient palace and fortress complex, built on a massive rock column, rises dramatically from the surrounding plains.</p><p>Built by King Kasyapa in the 5th century AD, Sigiriya is a masterpiece of ancient urban planning, architecture, and engineering. The site combines natural beauty with human ingenuity, creating a unique monument that has fascinated visitors for centuries.</p>',
        order: 1
      },
      {
        id: 'sigiriya-climb',
        type: 'text',
        heading: 'The Sigiriya Experience',
        content: '<p>Climbing Sigiriya is a memorable experience that takes visitors through different levels of the ancient complex. The climb begins with the beautiful water gardens at the base, followed by the boulder gardens, and then the terraced gardens.</p><p>Halfway up the rock, visitors encounter the famous Sigiriya frescoes - beautiful paintings of semi-nude women that have survived for over 1,500 years. The Mirror Wall, once polished to a mirror-like finish, contains ancient graffiti written by visitors over the centuries.</p>',
        order: 2
      },
      {
        id: 'sigiriya-summit',
        type: 'text',
        heading: 'The Summit',
        content: '<p>At the summit, visitors can explore the remains of the ancient palace complex, including the throne room, audience hall, and royal gardens. The panoramic views from the top are absolutely breathtaking, offering vistas of the surrounding countryside, distant mountains, and the Cultural Triangle.</p><p>The descent includes a visit to the Lion\'s Paw entrance, where massive lion\'s feet carved into the rock once formed the entrance to the palace. This architectural marvel showcases the skill and creativity of ancient Sri Lankan craftsmen.</p>',
        order: 3
      }
    ]
  },

  // ELLA
  {
    id: 'ella',
    slug: '/destinations/ella',
    title: 'Ella - Mountain Paradise in the Highlands',
    metaTitle: 'Ella Travel Guide | Mountain Town & Scenic Trails | Recharge Travels',
    metaDescription: 'Visit Ella, a charming mountain town in Sri Lanka\'s central highlands. Hike to Ella Rock, visit tea plantations, and enjoy scenic train rides. Plan your Ella adventure.',
    metaKeywords: 'Ella, mountain town, Ella Rock, tea plantations, scenic train, hiking, central highlands',
    heroTitle: 'Ella - Mountain Paradise in the Highlands',
    heroSubtitle: 'Discover Scenic Trails and Tea Plantations',
    heroImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920',
    status: 'published',
    sections: [
      {
        id: 'ella-intro',
        type: 'text',
        heading: 'Welcome to Ella',
        content: '<p>Ella, a small town nestled in the central highlands of Sri Lanka, is a paradise for nature lovers and adventure seekers. Surrounded by rolling hills, tea plantations, and misty mountains, Ella offers a perfect escape from the heat and hustle of the lowlands.</p><p>This charming mountain town has become a popular destination for backpackers and travelers seeking authentic experiences. With its cool climate, friendly locals, and stunning natural beauty, Ella provides the perfect setting for relaxation and adventure.</p>',
        order: 1
      },
      {
        id: 'ella-attractions',
        type: 'text',
        heading: 'Top Attractions',
        content: '<ul><li><strong>Ella Rock</strong> - Challenging hike with spectacular views</li><li><strong>Little Adam\'s Peak</strong> - Easier hike with panoramic vistas</li><li><strong>Nine Arch Bridge</strong> - Iconic colonial-era railway bridge</li><li><strong>Tea Plantations</strong> - Visit working tea estates</li><li><strong>Scenic Train Rides</strong> - Experience the famous Kandy-Ella train journey</li><li><strong>Waterfalls</strong> - Discover hidden waterfalls in the area</li></ul>',
        order: 2
      },
      {
        id: 'ella-activities',
        type: 'text',
        heading: 'Adventure Activities',
        content: '<p>Ella is a haven for outdoor activities. Hiking is the most popular activity, with trails ranging from easy walks to challenging climbs. The hike to Ella Rock offers spectacular views of the surrounding countryside, while Little Adam\'s Peak provides a more accessible option for families.</p><p>Other popular activities include cycling through tea plantations, visiting local villages, and enjoying the famous train journey from Kandy to Ella, which is considered one of the most scenic train rides in the world.</p>',
        order: 3
      }
    ]
  },

  // WILDLIFE TOURS
  {
    id: 'wildlife-tours',
    slug: '/tours/wildlife',
    title: 'Wildlife Tours - Safari Adventures in Sri Lanka',
    metaTitle: 'Wildlife Tours Sri Lanka | Safari Adventures & National Parks | Recharge Travels',
    metaDescription: 'Experience incredible wildlife tours in Sri Lanka. Go on safari adventures in national parks to see elephants, leopards, and exotic birds. Book your wildlife safari.',
    metaKeywords: 'wildlife tours, safari, national parks, elephants, leopards, birds, Yala, Udawalawe, Wilpattu',
    heroTitle: 'Wildlife Tours - Safari Adventures in Sri Lanka',
    heroSubtitle: 'Discover Exotic Wildlife in Their Natural Habitat',
    heroImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920',
    status: 'published',
    sections: [
      {
        id: 'wildlife-intro',
        type: 'text',
        heading: 'Wildlife Adventures in Sri Lanka',
        content: '<p>Sri Lanka is a paradise for wildlife enthusiasts, offering some of the best wildlife viewing opportunities in Asia. The island\'s diverse ecosystems, from dense rainforests to arid plains, support an incredible variety of wildlife species.</p><p>With over 20 national parks and wildlife sanctuaries, Sri Lanka provides excellent opportunities to observe elephants, leopards, sloth bears, crocodiles, and hundreds of bird species in their natural habitat. Our wildlife tours are designed to maximize your chances of encountering these magnificent creatures.</p>',
        order: 1
      },
      {
        id: 'national-parks',
        type: 'text',
        heading: 'Top National Parks',
        content: '<ul><li><strong>Yala National Park</strong> - Best for leopard sightings and diverse wildlife</li><li><strong>Udawalawe National Park</strong> - Famous for large elephant herds</li><li><strong>Wilpattu National Park</strong> - Largest national park with pristine wilderness</li><li><strong>Minneriya National Park</strong> - Known for the "Gathering" of elephants</li><li><strong>Sinharaja Forest Reserve</strong> - UNESCO site with endemic species</li><li><strong>Bundala National Park</strong> - Important wetland for migratory birds</li></ul>',
        order: 2
      },
      {
        id: 'wildlife-species',
        type: 'text',
        heading: 'Wildlife You Can See',
        content: '<p>Sri Lanka is home to an impressive array of wildlife species. The island has the highest density of leopards in the world, making it one of the best places for leopard sightings. Asian elephants are commonly seen in many parks, with some parks hosting herds of over 100 individuals.</p><p>Other mammals include sloth bears, water buffalo, spotted deer, sambar deer, wild boar, and various species of monkeys. The island is also a birdwatcher\'s paradise, with over 400 species of birds, including many endemic species.</p>',
        order: 3
      }
    ]
  },

  // CULTURAL TOURS
  {
    id: 'cultural-tours',
    slug: '/tours/cultural',
    title: 'Cultural Tours - Discover Sri Lanka\'s Rich Heritage',
    metaTitle: 'Cultural Tours Sri Lanka | Heritage Sites & Traditional Experiences | Recharge Travels',
    metaDescription: 'Explore Sri Lanka\'s rich cultural heritage through our cultural tours. Visit ancient temples, historical sites, and experience traditional customs. Book your cultural tour.',
    metaKeywords: 'cultural tours, heritage sites, temples, historical sites, traditional customs, Buddhism, ancient cities',
    heroTitle: 'Cultural Tours - Discover Sri Lanka\'s Rich Heritage',
    heroSubtitle: 'Explore Ancient Temples, Historical Sites & Traditional Customs',
    heroImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920',
    status: 'published',
    sections: [
      {
        id: 'cultural-intro',
        type: 'text',
        heading: 'Cultural Heritage of Sri Lanka',
        content: '<p>Sri Lanka\'s cultural heritage spans over 2,500 years, making it one of the oldest civilizations in the world. The island\'s strategic location on ancient trade routes has resulted in a unique blend of indigenous traditions and foreign influences.</p><p>From ancient Buddhist temples and royal palaces to colonial architecture and traditional villages, Sri Lanka offers visitors a fascinating journey through time. Our cultural tours are designed to provide authentic experiences that showcase the island\'s rich traditions and customs.</p>',
        order: 1
      },
      {
        id: 'cultural-sites',
        type: 'text',
        heading: 'Must-Visit Cultural Sites',
        content: '<ul><li><strong>Anuradhapura</strong> - Ancient capital with sacred Buddhist sites</li><li><strong>Polonnaruwa</strong> - Medieval capital with impressive ruins</li><li><strong>Kandy</strong> - Cultural capital and Temple of the Tooth</li><li><strong>Sigiriya</strong> - Ancient palace and fortress complex</li><li><strong>Dambulla Cave Temple</strong> - Ancient Buddhist cave temple</li><li><strong>Galle Fort</strong> - Colonial heritage site</li></ul>',
        order: 2
      },
      {
        id: 'cultural-experiences',
        type: 'text',
        heading: 'Traditional Experiences',
        content: '<p>Our cultural tours include authentic experiences that allow you to immerse yourself in Sri Lankan traditions. Witness traditional dance performances, participate in cooking classes to learn about local cuisine, visit artisan workshops to see traditional crafts being made, and interact with local communities.</p><p>You\'ll also have the opportunity to participate in religious ceremonies, learn about traditional medicine and Ayurveda, and experience the warm hospitality of the Sri Lankan people. These experiences provide a deeper understanding of the island\'s rich cultural tapestry.</p>',
        order: 3
      }
    ]
  }
];

async function populatePhase1Pages() {
  console.log('🚀 Starting Phase 1 Content Population...');
  console.log(`📝 Populating ${phase1Pages.length} high-priority pages`);
  
  let successCount = 0;
  let errorCount = 0;

  for (const page of phase1Pages) {
    try {
      console.log(`\n📄 Processing: ${page.title}`);
      
      // Add timestamps
      const pageData = {
        ...page,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'admin',
        language: 'en'
      };

      // Save to Firestore
      const docRef = doc(db, 'pages', page.id);
      await setDoc(docRef, pageData);
      
      console.log(`✅ Successfully saved: ${page.title}`);
      console.log(`   📍 URL: https://recharge-travels-73e76.web.app${page.slug}`);
      successCount++;
      
    } catch (error) {
      console.error(`❌ Error saving ${page.title}:`, error);
      errorCount++;
    }
  }

  console.log('\n🎉 Phase 1 Population Complete!');
  console.log(`✅ Successfully saved: ${successCount} pages`);
  if (errorCount > 0) {
    console.log(`❌ Errors: ${errorCount} pages`);
  }
  
  console.log('\n📋 Updated Pages:');
  phase1Pages.forEach(page => {
    console.log(`   • ${page.title} - ${page.slug}`);
  });
  
  console.log('\n🌐 Test your pages:');
  console.log('   • Homepage: https://recharge-travels-73e76.web.app/');
  console.log('   • Colombo: https://recharge-travels-73e76.web.app/destinations/colombo');
  console.log('   • Kandy: https://recharge-travels-73e76.web.app/destinations/kandy');
  console.log('   • Galle: https://recharge-travels-73e76.web.app/destinations/galle');
  console.log('   • Sigiriya: https://recharge-travels-73e76.web.app/destinations/sigiriya');
  console.log('   • Ella: https://recharge-travels-73e76.web.app/destinations/ella');
  console.log('   • Wildlife Tours: https://recharge-travels-73e76.web.app/tours/wildlife');
  console.log('   • Cultural Tours: https://recharge-travels-73e76.web.app/tours/cultural');
}

// Run the script
populatePhase1Pages()
  .then(() => {
    console.log('\n✅ Phase 1 population completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }); 