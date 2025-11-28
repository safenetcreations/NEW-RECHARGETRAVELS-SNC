import { collection, doc, setDoc, Timestamp } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

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

export const seedTeaTrailsExperience = async () => {
  try {
    console.log('🌱 Seeding Tea Trails experience data...');

    // Enhanced experience data with full admin control
    const experienceData = {
      id: 'tea-trails',
      slug: 'tea-trails',
      name: 'Sri Lanka Tea Trails',
      heroImageURL: 'https://images.unsplash.com/photo-1606820854416-439b3305ff39?q=80&w=3840&h=2160&auto=format&fit=crop',
      seo: {
        title: 'Sri Lanka Tea Trails | Ceylon Tea Estates & Scenic Walks – Recharge Travels',
        description: 'Walk emerald‑green plantations, visit 19th‑century tea factories and sip world‑famous Ceylon tea in misty hill country. Plan your perfect Tea‑Trails journey with Recharge Travels.',
        keywords: 'Sri Lanka tea trails, Ceylon tea, tea plantations, Nuwara Eliya, tea tasting, tea factory tour'
      },
      introParagraph: 'Wake to the aroma of fresh Ceylon tea, hike through velvety carpets of emerald leaves and learn 150 years of plantation lore from local pickers. Sri Lanka\'s Tea Trails weave between lofty peaks, tumbling waterfalls and colonial bungalows that once housed British planters. This experience pairs gentle adventure with liquid gold in your cup, revealing how a tiny leaf shaped the island\'s history—and still fuels its high‑country culture today.',
      highlights: [
        {
          icon: '🌿',
          title: 'Estate Walks',
          blurb60: 'Stroll with an expert guide among century‑old bushes and learn how altitude shapes aroma.'
        },
        {
          icon: '🫖',
          title: 'Factory & Tasting',
          blurb60: 'Tour a working 19th‑century factory, see withering & rolling, then taste white, green and classic BOP.'
        },
        {
          icon: '👒',
          title: 'Pluck‑Like‑a‑Pro',
          blurb60: 'Try your hand at two‑leaf‑and‑a‑bud picking alongside smiling estate workers.'
        },
        {
          icon: '🌄',
          title: 'Lipton\'s Seat Hike',
          blurb60: 'Sunrise trek to Sir Thomas Lipton\'s lookout for panoramas across five provinces.'
        }
      ],
      routes: [
        {
          routeName: 'Kandy → Hatton Heritage Line',
          duration: '1 day / 105 km',
          distanceKm: 105,
          bestClass: 'Observation coach',
          difficulty: 'Easy',
          elevation: '500-1500m',
          mapGPXUrl: null
        },
        {
          routeName: 'Nuwara Eliya Tea Loop',
          duration: '½ day / 30 km scenic drive',
          distanceKm: 30,
          bestClass: 'Private van',
          difficulty: 'Easy',
          elevation: '1800-2000m',
          mapGPXUrl: null
        },
        {
          routeName: 'Haputale → Lipton\'s Seat Trail',
          duration: '4 hr hike / 7 km',
          distanceKm: 7,
          bestClass: 'On foot',
          difficulty: 'Moderate',
          elevation: '1400-1800m',
          mapGPXUrl: null
        }
      ],
      galleryImages: [
        {
          url: 'https://images.unsplash.com/photo-1596018589855-e9c3e317c4dc?w=1200&h=800&auto=format&fit=crop',
          alt: 'Woman in vibrant sari plucking Ceylon tea leaves at sunrise',
          caption: 'Traditional tea plucking at dawn'
        },
        {
          url: 'https://images.unsplash.com/photo-1605451730973-b0e21c0b5b0a?w=1200&h=800&auto=format&fit=crop',
          alt: 'Old British tea factory with cast‑iron machinery in Sri Lanka',
          caption: 'Historic tea processing machinery'
        },
        {
          url: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=1200&h=800&auto=format&fit=crop',
          alt: 'Aerial view of terraced plantations and misty mountains near Haputale',
          caption: 'Breathtaking aerial view of tea terraces'
        },
        {
          url: 'https://images.unsplash.com/photo-1563911892727-df9c92c2d5d2?w=1200&h=800&auto=format&fit=crop',
          alt: 'Ceylon tea tasting session with traditional cups',
          caption: 'Authentic tea tasting experience'
        },
        {
          url: 'https://images.unsplash.com/photo-1606821306103-85ca0e88bdd8?w=1200&h=800&auto=format&fit=crop',
          alt: 'Misty morning over tea estate hills',
          caption: 'Misty mornings in the tea country'
        },
        {
          url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=1200&h=800&auto=format&fit=crop',
          alt: 'Tea pickers working in the plantations',
          caption: 'Dedicated tea plantation workers'
        }
      ],
      faqTag: 'tea-trails',
      faqs: [
        {
          question: 'What is the best time to visit tea plantations?',
          answer: 'The best time is from December to May when the weather is dry and clear. However, tea plantations can be visited year-round. The misty atmosphere during the monsoon season (June-September) also offers a unique charm.'
        },
        {
          question: 'Can I participate in tea plucking?',
          answer: 'Yes! Many estates offer tea plucking experiences where you can dress like a tea plucker and learn the traditional \'two leaves and a bud\' technique. It\'s usually available in the morning when actual plucking happens.'
        },
        {
          question: 'What should I wear when visiting tea estates?',
          answer: 'Wear comfortable walking shoes with good grip as paths can be steep and slippery. Bring layers as temperatures can be cool in the morning and evening. Long pants are recommended to protect against insects and plants.'
        },
        {
          question: 'How long does a typical tea factory tour take?',
          answer: 'A comprehensive factory tour usually takes 1.5 to 2 hours, including the processing demonstration and tea tasting session. Some estates offer shorter 45-minute tours.'
        },
        {
          question: 'Can I buy tea directly from the estates?',
          answer: 'Absolutely! Estate shops offer fresh tea at factory prices. You can buy various grades of tea, from premium whole leaf to everyday blends. Staff can help you choose based on your preferences.'
        }
      ],
      ctaHeadline: 'Sip the World\'s Finest Tea Where It\'s Grown',
      ctaSub: 'Let Recharge Travels craft your perfect hill‑country escape—private transport, colonial bungalows and insider tastings included.',
      videoURL: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      isPublished: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    // Save experience data
    await setDoc(doc(db, 'experiences', 'tea-trails'), experienceData);
    console.log('✅ Experience data seeded successfully');

    // Enhanced tours data with detailed information
    const toursData = [
      {
        id: 'tea-trails-ultimate',
        experienceSlug: 'tea-trails',
        title: 'Ultimate Tea Trail Experience',
        thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&auto=format&fit=crop',
        badges: ['Bestseller', 'Small Group'],
        duration: '3 Days',
        salePriceUSD: 299,
        regularPriceUSD: 399,
        highlights: [
          '3 Tea Estates Visit',
          'Factory Tours & Tastings',
          'Tea Plucking Experience',
          'Colonial Bungalow Stay',
          'Lipton\'s Seat Sunrise Trek'
        ],
        maxGroupSize: 12,
        includes: [
          'Private transportation',
          'Expert local guide',
          'All entrance fees',
          'Traditional meals',
          'Tea tasting sessions',
          'Colonial accommodation'
        ],
        excludes: [
          'International flights',
          'Travel insurance',
          'Personal expenses',
          'Gratuities'
        ],
        itinerary: [
          {
            day: 1,
            title: 'Arrival & Pedro Estate',
            description: 'Welcome to Sri Lanka! Transfer to Nuwara Eliya and visit the famous Pedro Tea Estate for your first tea experience.'
          },
          {
            day: 2,
            title: 'Factory Tour & Lipton\'s Seat',
            description: 'Morning factory tour followed by the iconic Lipton\'s Seat hike for breathtaking panoramic views.'
          },
          {
            day: 3,
            title: 'Tea Plucking & Departure',
            description: 'Learn traditional tea plucking techniques and enjoy a farewell high tea before your departure.'
          }
        ],
        isPublished: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
      {
        id: 'tea-trails-discovery',
        experienceSlug: 'tea-trails',
        title: 'Nuwara Eliya Tea Discovery',
        thumbnail: 'https://images.unsplash.com/photo-1589456506629-b2ea1a8576fb?w=400&h=300&auto=format&fit=crop',
        badges: ['Popular', 'Family Friendly'],
        duration: '2 Days',
        salePriceUSD: 189,
        highlights: [
          'Pedro Estate Tour',
          'Traditional High Tea',
          'City Walking Tour',
          'Lake Gregory Visit',
          'Tea Museum'
        ],
        maxGroupSize: 15,
        includes: [
          'Hotel pickup/drop-off',
          'Local guide',
          'Entrance fees',
          'Traditional lunch',
          'Tea tastings'
        ],
        excludes: [
          'Hotel accommodation',
          'International flights',
          'Personal expenses'
        ],
        isPublished: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
      {
        id: 'tea-trails-adventure',
        experienceSlug: 'tea-trails',
        title: 'Lipton\'s Seat Adventure',
        thumbnail: 'https://images.unsplash.com/photo-1606820854416-439b3305ff39?w=400&h=300&auto=format&fit=crop',
        badges: ['Adventure', 'Day Trip'],
        duration: '1 Day',
        salePriceUSD: 89,
        highlights: [
          'Sunrise Trek to Lipton\'s Seat',
          'Dambatenne Tea Factory',
          'Traditional Tea Tasting',
          'Scenic Drive Through Estates',
          'Photography Opportunities'
        ],
        maxGroupSize: 8,
        includes: [
          'Transportation from Colombo',
          'Professional guide',
          'Breakfast & lunch',
          'Entrance fees',
          'Bottled water'
        ],
        excludes: [
          'Hotel accommodation',
          'Travel insurance',
          'Personal expenses',
          'Gratuities'
        ],
        isPublished: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }
    ];

    // Save tours data
    for (const tour of toursData) {
      await setDoc(doc(db, 'tours', tour.id), tour);
    }
    console.log('✅ Tours data seeded successfully');

    console.log('🎉 Tea Trails seeding completed successfully!');
    console.log('📍 Experience: /experiences/tea-trails');
    console.log('📊 Total tours created:', toursData.length);
    console.log('🔧 Admin Panel: /admin → Experience Pages');

  } catch (error) {
    console.error('❌ Error seeding Tea Trails data:', error);
    throw error;
  }
};

// Firestore Security Rules for experiences collection
export const experienceSecurityRules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Experiences collection - public read, admin write
    match /experiences/{experienceId} {
      allow read: if true;
      allow write: if request.auth != null &&
        request.auth.token.admin == true;
      allow create: if request.auth != null &&
        request.auth.token.admin == true;
      allow update: if request.auth != null &&
        request.auth.token.admin == true;
      allow delete: if request.auth != null &&
        request.auth.token.admin == true;
    }

    // Tours collection - public read, admin write
    match /tours/{tourId} {
      allow read: if true;
      allow write: if request.auth != null &&
        request.auth.token.admin == true;
      allow create: if request.auth != null &&
        request.auth.token.admin == true;
      allow update: if request.auth != null &&
        request.auth.token.admin == true;
      allow delete: if request.auth != null &&
        request.auth.token.admin == true;
    }
  }
}
`;

// Usage instructions
export const usageInstructions = `
🫖 Tea Trails Experience Setup
===============================

1. Run the seed script:
   npm run seed:tea-trails

2. Update Firestore Security Rules:
   Copy the experienceSecurityRules to your Firestore rules

3. Admin Panel Access:
   - Go to /admin
   - Navigate to "Experience Pages"
   - Edit "Sri Lanka Tea Trails" experience
   - All content is now dynamically editable!

4. Content Management:
   - Hero image and SEO metadata
   - Experience highlights and routes
   - Gallery images with captions
   - FAQ section
   - Call-to-action content
   - Tour packages and pricing

5. Live Preview:
   Visit: /experiences/tea-trails

👨‍🍳 Cooking Class Experience Setup
====================================

1. Run the seed script:
   npm run seed:cooking-class

2. Admin Panel Access:
   - Go to /admin
   - Navigate to "Experience Pages"
   - Edit "Sri Lankan Cooking Classes" experience
   - All content is now dynamically editable!

3. Content Management:
   - Hero images and SEO metadata
   - Cooking class packages and pricing
   - Popular dishes and techniques
   - Gallery images with captions
   - FAQ section and class schedules
   - Contact information

4. Live Preview:
   Visit: /experiences/cooking-class-sri-lanka

🎯 All content is now fully admin-controlled via Firebase!
`;

// Seed Cooking Class Experience
export const seedCookingClassExperience = async () => {
  try {
    console.log('🍳 Seeding Cooking Class experience data...');

    const cookingClassData = {
      id: 'cooking-class-sri-lanka',
      slug: 'cooking-class-sri-lanka',
      name: 'Sri Lankan Cooking Classes',
      heroImageURL: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&h=1080&fit=crop',
      seo: {
        title: 'Sri Lankan Cooking Classes | Traditional Recipe Lessons | Recharge Travels',
        description: 'Learn authentic Sri Lankan cooking with expert chefs. From market visits to mastering curries, discover the secrets of Ceylon cuisine in hands-on classes.',
        keywords: 'Sri Lankan cooking class, learn Sri Lankan recipes, curry cooking lessons, Ceylon cuisine, cooking experience Colombo, traditional cooking'
      },
      introParagraph: 'Immerse yourself in the vibrant world of Sri Lankan cuisine through our hands-on cooking classes. Learn time-honored techniques, master the art of spice blending, and create authentic dishes that capture the essence of Ceylon\'s culinary heritage. From market tours to plate presentation, experience the complete journey of Sri Lankan cooking.',
      highlights: [
        { icon: '🛒', title: 'Market Adventure', blurb60: 'Begin with a visit to local markets to select the freshest ingredients and learn about exotic spices.' },
        { icon: '👨‍🍳', title: 'Hands-On Cooking', blurb60: 'Learn traditional techniques and spice combinations under expert guidance in professional kitchens.' },
        { icon: '🍽️', title: 'Authentic Recipes', blurb60: 'Master iconic dishes like Rice & Curry, Kottu Roti, Fish Ambul Thiyal, and traditional desserts.' },
        { icon: '📚', title: 'Recipe Collection', blurb60: 'Take home comprehensive recipe booklets with detailed instructions and spice substitution guides.' }
      ],
      cookingClasses: [
        {
          name: 'Essential Sri Lankan',
          duration: '3 hours',
          price: '$45 per person',
          highlights: ['5 authentic dishes', 'Market visit included', 'Recipe booklet', 'Lunch with your creations'],
          included: ['All ingredients', 'Professional chef', 'Cooking equipment', 'Printed recipes', 'Refreshments'],
          icon: 'UtensilsCrossed',
          level: 'Beginner',
          maxParticipants: 8
        },
        {
          name: 'Master Chef Experience',
          duration: '5 hours',
          price: '$75 per person',
          highlights: ['8-10 complex dishes', 'Advanced techniques', 'Spice blending workshop', 'Certificate of completion'],
          included: ['Premium ingredients', 'Expert chef instructor', 'Professional kitchen', 'Video recipes', 'Full meal service'],
          icon: 'Award',
          level: 'Intermediate',
          maxParticipants: 6
        },
        {
          name: 'Family Cooking Fun',
          duration: '2.5 hours',
          price: '$35 per person (kids 50% off)',
          highlights: ['Kid-friendly recipes', 'Interactive cooking', 'Fun presentations', 'Family meal together'],
          included: ['Simple ingredients', 'Family instructor', 'Kid-safe equipment', 'Fun aprons', 'Photo opportunities'],
          icon: 'Users',
          level: 'All Ages',
          maxParticipants: 12
        },
        {
          name: 'Vegetarian Delights',
          duration: '4 hours',
          price: '$55 per person',
          highlights: ['Plant-based menu', 'Ayurvedic principles', 'Organic ingredients', 'Health-focused recipes'],
          included: ['Organic produce', 'Specialist chef', 'Nutrition guide', 'Recipe collection', 'Herbal tea service'],
          icon: 'Star',
          level: 'All Levels',
          maxParticipants: 8
        }
      ],
      popularDishes: [
        {
          name: 'Rice & Curry',
          type: 'Main Course',
          difficulty: 'Medium',
          description: 'The national dish featuring rice with multiple curries including vegetables, meat, and sambols',
          keyIngredients: ['Basmati rice', 'Coconut milk', 'Curry leaves', 'Various spices']
        },
        {
          name: 'Kottu Roti',
          type: 'Street Food',
          difficulty: 'Easy',
          description: 'Chopped flatbread stir-fried with vegetables, eggs, and meat on a hot griddle',
          keyIngredients: ['Godamba roti', 'Vegetables', 'Eggs', 'Curry spices']
        },
        {
          name: 'Fish Ambul Thiyal',
          type: 'Curry',
          difficulty: 'Medium',
          description: 'Sour fish curry with goraka (garcinia), a signature dish from Southern Sri Lanka',
          keyIngredients: ['Tuna', 'Goraka', 'Black pepper', 'Curry leaves']
        },
        {
          name: 'Pol Sambol',
          type: 'Condiment',
          difficulty: 'Easy',
          description: 'Fresh coconut relish with chili, onions, and lime - essential accompaniment',
          keyIngredients: ['Fresh coconut', 'Red chili', 'Red onions', 'Lime juice']
        },
        {
          name: 'Hoppers (Appa)',
          type: 'Breakfast',
          difficulty: 'Hard',
          description: 'Bowl-shaped crispy pancakes made from fermented rice flour and coconut milk',
          keyIngredients: ['Rice flour', 'Coconut milk', 'Yeast', 'Sugar']
        },
        {
          name: 'Watalappan',
          type: 'Dessert',
          difficulty: 'Medium',
          description: 'Traditional coconut custard pudding with jaggery, cardamom, and cashews',
          keyIngredients: ['Coconut milk', 'Jaggery', 'Eggs', 'Cardamom']
        }
      ],
      cookingTechniques: [
        {
          technique: 'Tempering (Thunpaha)',
          description: 'The art of blooming spices in hot oil to release flavors',
          uses: 'Start of most curries'
        },
        {
          technique: 'Coconut Grinding',
          description: 'Fresh coconut preparation for milk extraction and sambols',
          uses: 'Base for curries and condiments'
        },
        {
          technique: 'Clay Pot Cooking',
          description: 'Traditional slow cooking method for enhanced flavors',
          uses: 'Rice dishes and slow curries'
        },
        {
          technique: 'Spice Roasting',
          description: 'Dry roasting whole spices to intensify flavors',
          uses: 'Spice blend preparation'
        }
      ],
      gallery: [
        { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', caption: 'Vibrant Sri Lankan Spices' },
        { url: 'https://images.unsplash.com/photo-1547592180-e55fa7d7f7c7?w=400&h=300&fit=crop', caption: 'Traditional Cooking Session' },
        { url: 'https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=400&h=300&fit=crop', caption: 'Fresh Local Ingredients' },
        { url: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop', caption: 'Authentic Curry Making' },
        { url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop', caption: 'Hands-On Experience' },
        { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', caption: 'Chef Demonstration' },
        { url: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=300&fit=crop', caption: 'Modern Kitchen Setup' },
        { url: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop', caption: 'Final Dish Presentation' }
      ],
      faqs: [
        {
          question: 'Do I need any cooking experience?',
          answer: 'No prior cooking experience is needed! Our classes cater to all skill levels, from complete beginners to experienced cooks. Our patient instructors guide you through each step, ensuring everyone can create delicious dishes regardless of their starting point.'
        },
        {
          question: 'Are the classes suitable for vegetarians/vegans?',
          answer: 'Absolutely! We offer dedicated vegetarian classes and can adapt most recipes to be vegan. Sri Lankan cuisine has many naturally vegetarian dishes. Please inform us of dietary requirements when booking, and we\'ll customize the menu accordingly.'
        },
        {
          question: 'What\'s included in the market visit?',
          answer: 'The market visit includes transportation, guide services, and ingredient purchases for the class. You\'ll learn to identify exotic vegetables, select fresh spices, understand local pricing, and experience the vibrant atmosphere of a Sri Lankan market.'
        },
        {
          question: 'Can I take the recipes home?',
          answer: 'Yes! All participants receive a recipe booklet with detailed instructions for recreating the dishes at home. We also provide tips on sourcing ingredients in your home country and suitable substitutions for hard-to-find items.'
        },
        {
          question: 'How spicy is the food?',
          answer: 'Sri Lankan food can be spicy, but we adjust the heat level to your preference. You\'ll learn to balance spices for flavor without overwhelming heat. We teach you how to control spiciness so you can adapt recipes to your taste.'
        },
        {
          question: 'What should I bring to the class?',
          answer: 'Just bring yourself and an appetite! We provide aprons, all cooking equipment, and ingredients. You might want to bring a camera to capture the experience and a container if you\'d like to take leftovers (though most people eat everything!).'
        }
      ],
      stats: [
        { icon: 'UtensilsCrossed', label: 'Dishes Taught', value: '30+' },
        { icon: 'Users', label: 'Happy Cooks', value: '5,000+' },
        { icon: 'Award', label: 'Years Experience', value: '15+' },
        { icon: 'Star', label: 'Google Rating', value: '4.9/5' }
      ],
      classSchedule: {
        morning: [
          { time: '9:00 AM - 12:00 PM', type: 'Essential Sri Lankan' },
          { time: '8:00 AM - 1:00 PM', type: 'Master Chef Experience' }
        ],
        afternoon: [
          { time: '2:00 PM - 5:00 PM', type: 'Essential Sri Lankan' },
          { time: '3:00 PM - 5:30 PM', type: 'Family Cooking Fun' }
        ]
      },
      contact: {
        phone: '+94 76 505 9595',
        email: 'info@rechargetravels.com',
        website: 'www.rechargetravels.com'
      },
      isPublished: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    // Save to Firestore
    await setDoc(doc(db, 'experiences', 'cooking-class-sri-lanka'), cookingClassData);
    console.log('✅ Cooking Class experience data seeded successfully!');
    console.log('📍 Experience: /experiences/cooking-class-sri-lanka');
    console.log('🔧 Admin Panel: /admin → Experience Pages');

  } catch (error) {
    console.error('❌ Error seeding Cooking Class data:', error);
    throw error;
  }
};


// Run the seeding function based on command line arguments
const args = process.argv.slice(2);
const command = args[0];

if (command === "cooking-class") {
  seedCookingClassExperience()
    .then(() => {
      console.log("✅ Cooking Class seeding completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Cooking Class seeding failed:", error);
      process.exit(1);
    });
} else {
  seedTeaTrailsExperience()
    .then(() => {
      console.log("✅ Tea Trails seeding completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Tea Trails seeding failed:", error);
      process.exit(1);
    });
}
