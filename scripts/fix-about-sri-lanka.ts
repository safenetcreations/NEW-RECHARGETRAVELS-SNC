import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBxGUhxqQqQqQqQqQqQqQqQqQqQqQqQqQ",
  authDomain: "recharge-travels-73e76.firebaseapp.com",
  projectId: "recharge-travels-73e76",
  storageBucket: "recharge-travels-73e76.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const aboutSriLankaContent = {
  id: 'about-sri-lanka',
  slug: '/about/sri-lanka',
  title: 'About Sri Lanka - The Pearl of the Indian Ocean',
  metaTitle: 'About Sri Lanka - The Pearl of the Indian Ocean | Recharge Travels',
  metaDescription: 'Discover Sri Lanka\'s rich history, diverse culture, and stunning natural beauty. Learn about the island\'s UNESCO World Heritage Sites, wildlife, and unique experiences.',
  metaKeywords: 'Sri Lanka, travel, tourism, culture, history, UNESCO, wildlife, beaches, temples, tea plantations',
  heroTitle: 'The Pearl of the Indian Ocean',
  heroSubtitle: 'Discover Sri Lanka\'s Rich Heritage and Natural Beauty',
  heroImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920',
  status: 'published',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  createdBy: 'admin',
  language: 'en',
  sections: [
    {
      id: 'main-description',
      type: 'text',
      heading: 'Welcome to Sri Lanka',
      content: '<p>Sri Lanka, a teardrop-shaped island in the Indian Ocean, offers an incredible diversity of experiences within its compact borders. From misty mountains and lush rainforests to golden beaches and ancient ruins, this tropical paradise has captivated travelers for centuries.</p><p>With a history spanning over 2,500 years, Sri Lanka boasts eight UNESCO World Heritage Sites, a rich cultural tapestry influenced by Buddhism, Hinduism, and colonial heritage, and some of the world\'s finest tea, spices, and gemstones.</p>',
      order: 1
    },
    {
      id: 'stats-section',
      type: 'stats',
      heading: 'Sri Lanka at a Glance',
      content: JSON.stringify([
        { value: '65,610', label: 'Square Kilometers', desc: 'Compact island paradise' },
        { value: '22M', label: 'Population', desc: 'Warm & welcoming people' },
        { value: '3,000+', label: 'Endemic Species', desc: 'Biodiversity hotspot' },
        { value: '8', label: 'UNESCO Sites', desc: 'World heritage treasures' }
      ]),
      order: 2
    },
    {
      id: 'highlights-section',
      type: 'text',
      heading: 'What Makes Sri Lanka Special',
      content: '<ul><li><strong>Ancient Buddhist temples and stupas</strong> - Sacred sites of spiritual significance</li><li><strong>Pristine beaches and coral reefs</strong> - Perfect for swimming, surfing, and diving</li><li><strong>Misty tea plantations</strong> - Experience the world-famous Ceylon tea</li><li><strong>Wildlife safaris in national parks</strong> - Spot elephants, leopards, and exotic birds</li><li><strong>Spice gardens and plantations</strong> - Discover the origins of world-famous spices</li><li><strong>Colonial architecture</strong> - Portuguese, Dutch, and British influences</li><li><strong>Traditional Ayurvedic treatments</strong> - Ancient healing practices</li><li><strong>Adventure sports and activities</strong> - Hiking, rafting, and water sports</li></ul>',
      order: 3
    },
    {
      id: 'cultural-info',
      type: 'text',
      heading: 'Cultural Heritage',
      content: '<p>Sri Lanka\'s cultural heritage is a fascinating blend of indigenous traditions and foreign influences. The island has been a crossroads of trade routes for centuries, resulting in a unique cultural mosaic that includes Buddhist temples, Hindu kovils, Islamic mosques, and Christian churches.</p><p>The island\'s rich cultural traditions are reflected in its festivals, arts, crafts, music, and dance forms, many of which have been preserved and passed down through generations.</p>',
      order: 4
    },
    {
      id: 'natural-info',
      type: 'text',
      heading: 'Natural Wonders',
      content: '<p>From the central highlands with their cool climate and tea estates to the coastal plains with palm-fringed beaches, Sri Lanka\'s diverse geography supports an incredible variety of ecosystems. The island is home to numerous national parks and wildlife sanctuaries.</p><p>The island\'s biodiversity is remarkable, with over 3,000 endemic species of plants and animals, making it one of the world\'s biodiversity hotspots.</p>',
      order: 5
    },
    {
      id: 'cta-section',
      type: 'cta',
      heading: 'Ready to Explore Sri Lanka?',
      content: 'Start planning your unforgettable journey to the Pearl of the Indian Ocean',
      order: 6,
      settings: {
        ctaButton: {
          text: 'Browse Our Tours',
          url: '/tours'
        }
      }
    }
  ],
  seoData: {
    ogTitle: 'About Sri Lanka - The Pearl of the Indian Ocean | Recharge Travels',
    ogDescription: 'Discover Sri Lanka\'s rich history, diverse culture, and stunning natural beauty. Learn about the island\'s UNESCO World Heritage Sites, wildlife, and unique experiences.',
    ogImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920',
    twitterCard: 'summary_large_image'
  }
};

async function fixAboutSriLankaPage() {
  console.log('🔧 Fixing About Sri Lanka page...');
  
  try {
    // Save to the new pages collection
    const docRef = doc(db, 'pages', 'about-sri-lanka');
    await setDoc(docRef, aboutSriLankaContent);
    
    console.log('✅ About Sri Lanka page content saved successfully!');
    console.log('📝 Content includes:');
    console.log('  • Hero section with title and image');
    console.log('  • Main description section');
    console.log('  • Statistics section');
    console.log('  • Highlights section');
    console.log('  • Cultural heritage section');
    console.log('  • Natural wonders section');
    console.log('  • Call-to-action section');
    console.log('  • SEO meta tags');
    
  } catch (error) {
    console.error('❌ Error fixing About Sri Lanka page:', error);
    throw error;
  }
}

// Run the script
fixAboutSriLankaPage()
  .then(() => {
    console.log('✅ Script completed successfully!');
    console.log('🌐 Visit: https://recharge-travels-73e76.web.app/about/sri-lanka');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }); 