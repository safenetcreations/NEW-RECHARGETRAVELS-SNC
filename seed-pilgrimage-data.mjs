// Pilgrimage Tours Data Seeding Script
// Run with: node seed-pilgrimage-data.mjs

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCxFnQfMo3rOWhgm1_yiRIh0Oez246U2N0",
  authDomain: "recharge-travels-73e76.firebaseapp.com",
  projectId: "recharge-travels-73e76",
  storageBucket: "recharge-travels-73e76.firebasestorage.app",
  messagingSenderId: "515581447537",
  appId: "1:515581447537:web:b4f65bf9c2544c65d6fad0",
  measurementId: "G-W2MJBDFDG3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Helper function to add documents
async function addDocument(collectionName, data, customId = null) {
  try {
    if (customId) {
      await setDoc(doc(db, collectionName, customId), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`Added ${collectionName}/${customId}`);
    } else {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`Added ${collectionName}/${docRef.id}`);
    }
  } catch (error) {
    console.error(`Error adding to ${collectionName}:`, error);
  }
}

// Pilgrimage Content (Hero, CTA, etc.)
const pilgrimageContent = {
  hero: {
    title: "Sacred Pilgrimages of Sri Lanka",
    subtitle: "Journey Through Ancient Temples and Holy Sites",
    description: "Embark on a spiritual journey through Sri Lanka's most sacred sites. From the footprint of Lord Buddha atop Adam's Peak to the sacred Temple of the Tooth in Kandy, experience the profound spirituality that has drawn pilgrims for millennia.",
    backgroundImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1920&q=80",
    stats: [
      { value: "2500+", label: "Years of Buddhist Heritage" },
      { value: "16", label: "UNESCO World Heritage Sites" },
      { value: "5000+", label: "Ancient Temples" },
      { value: "4.9", label: "Pilgrim Rating" }
    ]
  },
  cta: {
    title: "Begin Your Spiritual Journey",
    description: "Let us guide you through the sacred lands of Sri Lanka. Our expert pilgrimage guides ensure a meaningful and transformative experience.",
    buttonText: "Plan Your Pilgrimage",
    backgroundImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&q=80"
  },
  booking: {
    contactEmail: "pilgrimages@rechargetravels.com",
    contactPhone: "+94 77 123 4567",
    whatsapp: "+94771234567",
    bookingNote: "All pilgrimage tours include temple offerings, religious ceremonies access, and vegetarian meals"
  }
};

// Pilgrimage Sites
const pilgrimageSites = [
  {
    id: "sri-pada",
    name: "Sri Pada (Adam's Peak)",
    location: "Central Highlands",
    description: "Sacred mountain with a footprint at the summit, revered by Buddhists, Hindus, Muslims, and Christians. The pilgrimage season runs from December to May.",
    thumbnail: "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=800&q=80",
    significance: "Holy mountain with sacred footprint - revered by four religions",
    bestTime: "December to May (Pilgrimage Season)",
    altitude: "2,243 meters",
    climbDuration: "4-6 hours",
    features: ["Night climb for sunrise", "Ancient steps", "Temple at summit", "Multi-faith site"],
    isPublished: true,
    order: 1
  },
  {
    id: "tooth-temple",
    name: "Temple of the Sacred Tooth Relic",
    location: "Kandy",
    description: "Houses Sri Lanka's most important Buddhist relic - a tooth of Lord Buddha. The temple is a UNESCO World Heritage Site and the spiritual center of Sri Lankan Buddhism.",
    thumbnail: "https://images.unsplash.com/photo-1588676836045-45772c08b51e?w=800&q=80",
    significance: "Most sacred Buddhist temple in Sri Lanka - Houses Buddha's tooth relic",
    bestTime: "Year-round, Esala Perahera festival in July/August",
    features: ["Daily puja ceremonies", "Museum complex", "Royal Palace grounds", "Evening ceremonies"],
    isPublished: true,
    order: 2
  },
  {
    id: "anuradhapura",
    name: "Anuradhapura Sacred City",
    location: "North Central Province",
    description: "Ancient capital with massive stupas, sacred Bodhi tree, and ruins spanning over 2,000 years. The Sri Maha Bodhi is the oldest historically documented tree in the world.",
    thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
    significance: "Ancient sacred city with the oldest documented tree in the world",
    bestTime: "Year-round, avoid extreme heat April-May",
    features: ["Sri Maha Bodhi Tree", "Ruwanwelisaya Stupa", "Thuparamaya", "Jetavanaramaya"],
    isPublished: true,
    order: 3
  },
  {
    id: "polonnaruwa",
    name: "Polonnaruwa Sacred Quadrangle",
    location: "North Central Province",
    description: "Medieval capital with remarkable Buddhist architecture including the famous Gal Vihara rock sculptures - considered masterpieces of Sinhalese Buddhist art.",
    thumbnail: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80",
    significance: "Medieval Buddhist capital with masterpiece rock sculptures",
    bestTime: "Year-round",
    features: ["Gal Vihara Buddha statues", "Sacred Quadrangle", "Lankatilaka", "Rankot Vihara"],
    isPublished: true,
    order: 4
  },
  {
    id: "dambulla",
    name: "Dambulla Cave Temple",
    location: "Central Province",
    description: "Five cave temples with over 150 Buddha statues and elaborate murals covering 2,100 square meters. A UNESCO World Heritage Site dating back to the 1st century BC.",
    thumbnail: "https://images.unsplash.com/photo-1588676836045-45772c08b51e?w=800&q=80",
    significance: "Largest and best-preserved cave temple complex in Sri Lanka",
    bestTime: "Year-round",
    features: ["153 Buddha statues", "Ancient murals", "Golden Temple", "Panoramic views"],
    isPublished: true,
    order: 5
  },
  {
    id: "kataragama",
    name: "Kataragama Sacred City",
    location: "Uva Province",
    description: "Multi-religious pilgrimage site sacred to Buddhists, Hindus, Muslims, and indigenous Veddas. The Kataragama Devale shrine attracts millions during the annual festival.",
    thumbnail: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80",
    significance: "Multi-faith sacred city with annual fire-walking festival",
    bestTime: "July-August for Esala Festival",
    features: ["Kiri Vehera stupa", "Kataragama Devale", "Menik Ganga river", "Fire-walking ceremonies"],
    isPublished: true,
    order: 6
  },
  {
    id: "mihintale",
    name: "Mihintale",
    location: "North Central Province",
    description: "The cradle of Buddhism in Sri Lanka - where Arahat Mahinda converted King Devanampiyatissa in 247 BC. Contains ancient monasteries and stupas on a sacred mountain.",
    thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
    significance: "Birthplace of Buddhism in Sri Lanka",
    bestTime: "Full moon Poson Poya (June)",
    features: ["1,840 ancient steps", "Mahinda's Cave", "Ambasthale Dagaba", "Hospital ruins"],
    isPublished: true,
    order: 7
  },
  {
    id: "nagadeepa",
    name: "Nagadeepa Purana Viharaya",
    location: "Jaffna District",
    description: "One of the 16 sacred places in Sri Lanka visited by Lord Buddha. Located on Nainativu island, accessible by boat from Kurikadduwan jetty.",
    thumbnail: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80",
    significance: "Site of Buddha's second visit to Sri Lanka",
    bestTime: "Year-round (avoid monsoon season)",
    features: ["Ancient stupa", "Buddha footprint", "Island temple", "Naga shrine"],
    isPublished: true,
    order: 8
  }
];

// Pilgrimage Tours
const pilgrimageTours = [
  {
    id: "sacred-triangle",
    title: "Sacred Triangle Pilgrimage",
    thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
    badges: ["Best Seller", "UNESCO Sites"],
    duration: "4 Days / 3 Nights",
    salePriceUSD: 549,
    regularPriceUSD: 699,
    highlights: [
      "Anuradhapura sacred city and Sri Maha Bodhi",
      "Polonnaruwa ancient ruins and Gal Vihara",
      "Dambulla Cave Temple",
      "Sigiriya Rock Fortress (optional)"
    ],
    included: [
      "Comfortable transportation",
      "English-speaking Buddhist guide",
      "3 nights accommodation",
      "Daily breakfast and lunch",
      "Temple entrance fees",
      "Offerings and flowers"
    ],
    type: "Group Tour",
    sites: ["anuradhapura", "polonnaruwa", "dambulla"],
    isPublished: true,
    order: 1
  },
  {
    id: "adams-peak-pilgrimage",
    title: "Sri Pada Night Climb Experience",
    thumbnail: "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=800&q=80",
    badges: ["Seasonal", "Adventure"],
    duration: "2 Days / 1 Night",
    salePriceUSD: 189,
    regularPriceUSD: 249,
    highlights: [
      "Guided night climb with headlamps",
      "Sunrise at the sacred summit",
      "Temple visit and blessings",
      "Scenic tea country drive"
    ],
    included: [
      "Transportation from Colombo/Kandy",
      "Experienced climbing guide",
      "1 night pre-climb accommodation",
      "Light breakfast and snacks",
      "Headlamp and walking stick"
    ],
    type: "Group Tour",
    sites: ["sri-pada"],
    seasonNote: "Available December to May only",
    isPublished: true,
    order: 2
  },
  {
    id: "kandy-temple-tour",
    title: "Temple of the Tooth & Kandy Heritage",
    thumbnail: "https://images.unsplash.com/photo-1588676836045-45772c08b51e?w=800&q=80",
    badges: ["Daily", "Cultural"],
    duration: "1 Day",
    salePriceUSD: 89,
    regularPriceUSD: 119,
    highlights: [
      "Morning puja ceremony at Temple of the Tooth",
      "Royal Palace complex tour",
      "Kandyan cultural show",
      "Peradeniya Botanical Gardens"
    ],
    included: [
      "AC vehicle transport",
      "Licensed guide",
      "Temple entrance fees",
      "Cultural show tickets",
      "Lunch at local restaurant"
    ],
    type: "Private Tour",
    sites: ["tooth-temple"],
    isPublished: true,
    order: 3
  },
  {
    id: "complete-pilgrimage",
    title: "Complete Sri Lanka Pilgrimage",
    thumbnail: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80",
    badges: ["Premium", "All-Inclusive"],
    duration: "10 Days / 9 Nights",
    salePriceUSD: 1899,
    regularPriceUSD: 2399,
    highlights: [
      "All 8 major pilgrimage sites",
      "Adam's Peak sunrise climb",
      "Kataragama festival experience",
      "Nagadeepa island temple",
      "Buddhist meditation sessions",
      "Hindu kovil visits"
    ],
    included: [
      "Luxury AC vehicle",
      "Expert Buddhist scholar guide",
      "9 nights 4-star hotels",
      "All meals (vegetarian options)",
      "All entrance fees",
      "Domestic flights where needed",
      "Traditional offerings at all temples"
    ],
    type: "Private Tour",
    sites: ["sri-pada", "tooth-temple", "anuradhapura", "polonnaruwa", "dambulla", "kataragama", "mihintale", "nagadeepa"],
    isPublished: true,
    order: 4
  },
  {
    id: "buddhist-meditation",
    title: "Buddhist Meditation Retreat",
    thumbnail: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80",
    badges: ["Wellness", "Spiritual"],
    duration: "5 Days / 4 Nights",
    salePriceUSD: 699,
    regularPriceUSD: 899,
    highlights: [
      "Stay at traditional forest monastery",
      "Daily meditation with monks",
      "Dharma talks and teachings",
      "Silent retreat option",
      "Temple visits in Kandy area"
    ],
    included: [
      "Monastery accommodation",
      "Simple vegetarian meals",
      "Meditation instruction",
      "All temple visits",
      "Transportation"
    ],
    type: "Retreat",
    sites: ["tooth-temple"],
    isPublished: true,
    order: 5
  },
  {
    id: "hindu-kovil-tour",
    title: "Hindu Temples of Sri Lanka",
    thumbnail: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80",
    badges: ["Multi-Faith", "Cultural"],
    duration: "6 Days / 5 Nights",
    salePriceUSD: 799,
    regularPriceUSD: 999,
    highlights: [
      "Nallur Kandaswamy Temple, Jaffna",
      "Kataragama Murugan Temple",
      "Munneswaram Temple",
      "Thiruketheeswaram Temple",
      "Nagadeepa Amman Kovil"
    ],
    included: [
      "AC vehicle with driver",
      "Hindu priest guide",
      "5 nights accommodation",
      "All meals",
      "Puja offerings at all temples"
    ],
    type: "Private Tour",
    sites: ["kataragama", "nagadeepa"],
    isPublished: true,
    order: 6
  }
];

// Pilgrimage FAQs
const pilgrimageFaqs = [
  {
    question: "What should I wear when visiting Buddhist temples?",
    answer: "Dress modestly with shoulders and knees covered. White clothing is preferred for temple visits as it symbolizes purity. Remove shoes and hats before entering temple premises. Avoid clothing with Buddha images - this is considered disrespectful in Sri Lanka.",
    order: 1
  },
  {
    question: "Is the Adam's Peak climb suitable for beginners?",
    answer: "The climb is challenging with over 5,000 steps, but people of all ages complete it during pilgrimage season. The climb typically takes 4-6 hours. We recommend reasonable fitness, proper footwear, and taking breaks. The season (December-May) offers the best weather and lit pathways.",
    order: 2
  },
  {
    question: "Can non-Buddhists visit the Temple of the Tooth?",
    answer: "Yes, the Temple of the Tooth welcomes visitors of all faiths. However, please observe temple etiquette: dress modestly, remove shoes, and be respectful during ceremonies. Photography may be restricted in certain areas, especially during puja times.",
    order: 3
  },
  {
    question: "What is the best time for a pilgrimage to Sri Lanka?",
    answer: "For Adam's Peak, December to May is the pilgrimage season. For other sites, year-round is suitable, though June's Poson Poya at Mihintale and July/August's Esala Perahera in Kandy are particularly special. Avoid April-May for Anuradhapura due to extreme heat.",
    order: 4
  },
  {
    question: "Are vegetarian meals available during the tour?",
    answer: "Yes, all our pilgrimage tours include vegetarian meal options. Many pilgrims prefer vegetarian food during their spiritual journey, and we ensure high-quality, nutritious vegetarian Sri Lankan cuisine is available throughout your trip.",
    order: 5
  },
  {
    question: "Do I need special permits for any pilgrimage sites?",
    answer: "Most sites require entrance tickets which are included in our tour packages. The Cultural Triangle sites (Anuradhapura, Polonnaruwa, Dambulla) are covered by a single ticket. UNESCO World Heritage Sites have separate fees for foreigners. All permits are arranged as part of our tours.",
    order: 6
  },
  {
    question: "Can I participate in religious ceremonies?",
    answer: "Yes, visitors can participate in many ceremonies like lighting oil lamps, offering flowers, and attending puja. Our guides will explain the significance and proper etiquette. Some inner sanctums may be restricted to ordained monks, but most temple areas are accessible.",
    order: 7
  },
  {
    question: "Is photography allowed at religious sites?",
    answer: "Photography is generally allowed at most sites but prohibited in certain sacred areas and during ceremonies. Never pose with your back to Buddha statues. Flash photography is usually not permitted inside temples. Our guides will advise on specific restrictions.",
    order: 8
  }
];

// Pilgrimage Testimonials
const pilgrimageTestimonials = [
  {
    name: "Dr. Sarah Mitchell",
    location: "London, UK",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
    rating: 5,
    text: "The Sacred Triangle tour was transformative. Standing before the ancient Bodhi tree in Anuradhapura, I felt connected to 2,500 years of Buddhist history. Our guide's knowledge of Buddhist philosophy added profound depth to every site.",
    tourName: "Sacred Triangle Pilgrimage",
    date: "November 2024"
  },
  {
    name: "Rajesh Kumar",
    location: "Chennai, India",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
    rating: 5,
    text: "Climbing Adam's Peak in the darkness and reaching the summit for sunrise was a life-changing experience. The spiritual energy at the top, with pilgrims of all faiths praying together, was incredibly moving.",
    tourName: "Sri Pada Night Climb",
    date: "January 2024"
  },
  {
    name: "Maria Santos",
    location: "Manila, Philippines",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80",
    rating: 5,
    text: "The Complete Sri Lanka Pilgrimage exceeded all expectations. From the serenity of Mihintale to the vibrant devotion at Kataragama, every day brought new spiritual insights. The meditation sessions with monks were particularly meaningful.",
    tourName: "Complete Sri Lanka Pilgrimage",
    date: "October 2024"
  },
  {
    name: "Thomas Weber",
    location: "Munich, Germany",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80",
    rating: 5,
    text: "As a Buddhist practitioner from the West, visiting these ancient sites in person was deeply fulfilling. The Gal Vihara Buddha statues in Polonnaruwa brought tears to my eyes. Recharge Travels handled everything perfectly.",
    tourName: "Sacred Triangle Pilgrimage",
    date: "December 2024"
  }
];

// Pilgrimage Guidelines
const pilgrimageGuidelines = [
  {
    title: "Dress Code",
    icon: "shirt",
    description: "Wear modest clothing covering shoulders and knees. White is preferred. Remove shoes and hats before entering temples.",
    order: 1
  },
  {
    title: "Temple Etiquette",
    icon: "temple",
    description: "Walk clockwise around stupas. Never point feet toward Buddha statues. Stand aside for monks to pass. No loud conversations.",
    order: 2
  },
  {
    title: "Photography",
    icon: "camera",
    description: "Never pose with back to Buddha. No flash inside temples. Ask permission before photographing people or ceremonies.",
    order: 3
  },
  {
    title: "Offerings",
    icon: "flower",
    description: "Lotus flowers and oil lamps are traditional offerings. We provide appropriate offerings at each site included in your tour.",
    order: 4
  },
  {
    title: "Full Moon Days",
    icon: "moon",
    description: "Poya (full moon) days are sacred Buddhist holidays. Temples are busier but ceremonies are more elaborate. Alcohol sales are restricted.",
    order: 5
  },
  {
    title: "Respect",
    icon: "heart",
    description: "These are living places of worship, not just tourist sites. Approach with reverence and openness to spiritual experience.",
    order: 6
  }
];

// Main seeding function
async function seedPilgrimageData() {
  console.log('Starting Pilgrimage Tours data seeding...\n');

  // Seed content
  console.log('Seeding pilgrimage content...');
  await addDocument('pilgrimage_content', pilgrimageContent, 'main');

  // Seed sites
  console.log('\nSeeding pilgrimage sites...');
  for (const site of pilgrimageSites) {
    await addDocument('pilgrimage_sites', site, site.id);
  }

  // Seed tours
  console.log('\nSeeding pilgrimage tours...');
  for (const tour of pilgrimageTours) {
    await addDocument('pilgrimage_tours', tour, tour.id);
  }

  // Seed FAQs
  console.log('\nSeeding pilgrimage FAQs...');
  for (const faq of pilgrimageFaqs) {
    await addDocument('pilgrimage_faqs', faq);
  }

  // Seed testimonials
  console.log('\nSeeding pilgrimage testimonials...');
  for (const testimonial of pilgrimageTestimonials) {
    await addDocument('pilgrimage_testimonials', testimonial);
  }

  // Seed guidelines
  console.log('\nSeeding pilgrimage guidelines...');
  for (const guideline of pilgrimageGuidelines) {
    await addDocument('pilgrimage_guidelines', guideline);
  }

  console.log('\n========================================');
  console.log('Pilgrimage Tours data seeding completed!');
  console.log('========================================');
  console.log('\nSeeded:');
  console.log(`- 1 content document`);
  console.log(`- ${pilgrimageSites.length} pilgrimage sites`);
  console.log(`- ${pilgrimageTours.length} pilgrimage tours`);
  console.log(`- ${pilgrimageFaqs.length} FAQs`);
  console.log(`- ${pilgrimageTestimonials.length} testimonials`);
  console.log(`- ${pilgrimageGuidelines.length} guidelines`);

  process.exit(0);
}

// Run the seeding
seedPilgrimageData().catch(console.error);
