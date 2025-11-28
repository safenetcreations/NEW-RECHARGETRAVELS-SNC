import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, Timestamp } from 'firebase/firestore';

// Firebase configuration - using your project config
const firebaseConfig = {
  apiKey: "AIzaSyDNCnsezV7YETXL5xX0vlJgkhLJ3yUnKzw",
  authDomain: "new-rechargetravels-snc.firebaseapp.com",
  projectId: "new-rechargetravels-snc",
  storageBucket: "new-rechargetravels-snc.firebasestorage.app",
  messagingSenderId: "385920780498",
  appId: "1:385920780498:web:84e9e1faff7c6c6b10f4f6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const seedCookingClassExperience = async () => {
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
    console.log('');
    console.log('🎉 Data saved to Firestore! The cooking class page will now load dynamic content.');

  } catch (error) {
    console.error('❌ Error seeding Cooking Class data:', error);
    throw error;
  }
};

// Run the seeding
seedCookingClassExperience()
  .then(() => {
    console.log('');
    console.log('✨ All done! Refresh your cooking class page to see the changes.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed:', error);
    process.exit(1);
  });
