/**
 * YALU Knowledge Base Builder
 * Extracts content from the website to create a comprehensive knowledge base
 * for ElevenLabs Conversational AI Agent
 */

// Website content for YALU's knowledge base
export const YALU_KNOWLEDGE_BASE = {
  company: {
    name: "Recharge Travels",
    description: "Sri Lanka's premier travel and tour company offering bespoke experiences across the island",
    founded: "2018",
    location: "Colombo, Sri Lanka",
    contact: {
      phone: "+94 777 721 999",
      email: "concierge@rechargetravels.com",
      whatsapp: "https://wa.me/94777721999",
      website: "https://www.rechargetravels.com"
    },
    services: [
      "Custom Trip Planning",
      "Wildlife Safaris",
      "Beach Holidays",
      "Cultural Tours",
      "Adventure Tours",
      "Wellness & Ayurveda",
      "Cooking Classes",
      "Train Journeys",
      "Island Getaways",
      "Vehicle Rentals",
      "Hotel Bookings"
    ],
    uniqueSellingPoints: [
      "24/7 WhatsApp concierge support",
      "Local Sri Lankan experts",
      "Handpicked luxury & boutique stays",
      "Private guided tours",
      "Flexible itineraries",
      "Best price guarantee"
    ]
  },

  destinations: {
    colombo: {
      description: "Sri Lanka's vibrant capital city, blending colonial heritage with modern skyscrapers",
      highlights: ["Galle Face Green", "Gangaramaya Temple", "Pettah Market", "Dutch Hospital"],
      bestFor: ["Shopping", "Food tours", "City exploration", "Nightlife"],
      weather: "Hot and humid year-round, 27-32°C"
    },
    kandy: {
      description: "The cultural heart of Sri Lanka, home to the Sacred Temple of the Tooth",
      highlights: ["Temple of the Tooth", "Royal Botanical Gardens", "Kandy Lake", "Esala Perahera"],
      bestFor: ["Culture", "Religion", "Tea country gateway", "Traditional arts"],
      weather: "Cooler than coast, 20-28°C"
    },
    galle: {
      description: "Historic Dutch fort city with charming cobblestone streets and boutique hotels",
      highlights: ["Galle Fort UNESCO", "Dutch Reformed Church", "Lighthouse", "Art galleries"],
      bestFor: ["History", "Photography", "Boutique shopping", "Romantic getaways"],
      weather: "Tropical, best December-April"
    },
    ella: {
      description: "Scenic hill country town famous for hiking trails and the iconic Nine Arches Bridge",
      highlights: ["Nine Arches Bridge", "Ella Rock", "Little Adam's Peak", "Ravana Falls"],
      bestFor: ["Hiking", "Train rides", "Nature", "Backpackers"],
      weather: "Cool and pleasant, 15-25°C"
    },
    sigiriya: {
      description: "Ancient rock fortress rising 200m above the surrounding jungle - UNESCO World Heritage",
      highlights: ["Lion Rock", "Mirror Wall frescoes", "Royal Gardens", "Pidurangala Rock"],
      bestFor: ["History", "Architecture", "Sunrise views", "Photography"],
      weather: "Hot and dry, best early morning visits"
    },
    mirissa: {
      description: "Paradise beach town famous for whale watching and stunning sunsets",
      highlights: ["Whale watching", "Coconut Tree Hill", "Secret Beach", "Surfing"],
      bestFor: ["Blue whales", "Beaches", "Nightlife", "Surfing"],
      weather: "Best November-April for whales and calm seas"
    },
    yala: {
      description: "Sri Lanka's most famous national park with highest leopard density in the world",
      highlights: ["Leopards", "Elephants", "Sloth bears", "Bird watching"],
      bestFor: ["Wildlife safaris", "Photography", "Nature lovers"],
      weather: "Dry season best: Feb-July"
    },
    nuwaraEliya: {
      description: "Little England - Cool hill station with tea plantations and colonial architecture",
      highlights: ["Tea factories", "Gregory Lake", "Horton Plains", "Victoria Park"],
      bestFor: ["Tea tasting", "Cool weather escape", "Golf", "Waterfalls"],
      weather: "Cool year-round, 10-20°C, can be rainy"
    },
    trincomalee: {
      description: "East coast port city with pristine beaches and ancient Hindu temples",
      highlights: ["Nilaveli Beach", "Pigeon Island", "Koneswaram Temple", "Hot wells"],
      bestFor: ["Snorkeling", "Diving", "Temples", "Whale watching (Mar-Aug)"],
      weather: "Best May-September"
    },
    arugamBay: {
      description: "World-renowned surfing destination on the east coast",
      highlights: ["Main Point surf break", "Pottuvil Lagoon", "Kumana National Park"],
      bestFor: ["Surfing", "Yoga", "Beach parties", "Wildlife"],
      weather: "Best April-October for surf"
    },
    jaffna: {
      description: "Northern cultural capital with unique Tamil heritage and cuisine",
      highlights: ["Nallur Temple", "Jaffna Fort", "Islands", "Crab curry"],
      bestFor: ["Culture", "Food", "Off-beaten path", "Temples"],
      weather: "Hot and dry, best December-March"
    }
  },

  experiences: {
    wildlifeSafaris: {
      description: "Private jeep safaris in Sri Lanka's national parks",
      parks: ["Yala", "Udawalawe", "Minneriya", "Wilpattu", "Horton Plains"],
      animals: ["Leopards", "Elephants", "Sloth bears", "Crocodiles", "350+ bird species"],
      pricing: "From USD 80 per person (half-day)",
      bestTime: "Early morning (5:30 AM) or late afternoon (3:30 PM)",
      tips: ["Book private jeeps for better sightings", "Yala Block 1 for leopards", "Minneriya for elephant gathering (July-Oct)"]
    },
    whaleWatching: {
      description: "Blue whale and sperm whale watching off the south coast",
      locations: ["Mirissa (main)", "Trincomalee (east)", "Kalpitiya"],
      season: "November-April (south), March-August (east)",
      pricing: "From USD 50 per person",
      successRate: "90% sighting success in season",
      tips: ["Take sea sickness medication", "Book 6 AM departure", "Raja & the Whales is most ethical operator"]
    },
    cookingClasses: {
      description: "Learn authentic Sri Lankan cuisine from local chefs",
      locations: ["Colombo", "Kandy", "Dambulla", "Galle", "Jaffna", "Bentota"],
      dishes: ["Rice & curry", "Kottu roti", "Hoppers", "Crab curry", "Pol sambol"],
      pricing: "From USD 45 per person",
      duration: "3-4 hours including meal",
      includes: ["Market tour", "All ingredients", "Recipe cards", "Full meal"]
    },
    trainJourneys: {
      description: "Scenic train rides through tea country and mountains",
      routes: [
        { name: "Kandy to Ella", duration: "6-7 hours", highlights: "Tea plantations, Nine Arches Bridge" },
        { name: "Colombo to Kandy", duration: "2.5 hours", highlights: "River valleys, mountain views" },
        { name: "Nanu Oya to Ella", duration: "3 hours", highlights: "Best scenic section" }
      ],
      pricing: "1st class: USD 15, 2nd class: USD 8, 3rd class: USD 3",
      tips: ["Book 45 days ahead for 1st class", "Right side for best views Kandy-Ella", "Observation car is magical"]
    },
    islandGetaways: {
      description: "Day trips and overnight stays to Sri Lanka's beautiful islands",
      islands: [
        { name: "Delft Island", location: "Jaffna", highlight: "Wild ponies, Dutch ruins" },
        { name: "Pigeon Island", location: "Trincomalee", highlight: "Snorkeling, coral reefs" },
        { name: "Nagadeepa", location: "Jaffna", highlight: "Sacred Buddhist & Hindu temples" }
      ],
      pricing: "From USD 60 per person including boat"
    },
    ayurvedaWellness: {
      description: "Traditional Ayurvedic treatments and wellness retreats",
      treatments: ["Full body massage", "Shirodhara", "Herbal steam bath", "Detox programs"],
      duration: "Day treatments to 14-day retreats",
      pricing: "From USD 50 (day) to USD 2500+ (2-week retreat)",
      topCenters: ["Siddhalepa Ayurveda", "Barberyn Beach", "Santani"]
    }
  },

  practicalInfo: {
    visa: {
      eta: "Electronic Travel Authorization required before arrival",
      cost: "USD 50 for 30 days (can extend to 90 days)",
      applyAt: "www.eta.gov.lk",
      processing: "Usually 24-48 hours"
    },
    currency: {
      name: "Sri Lankan Rupee (LKR)",
      exchange: "Approximately 320 LKR = 1 USD (rates vary)",
      tips: "ATMs widely available, cards accepted in cities, cash needed for rural areas"
    },
    bestTimeToVisit: {
      westAndSouth: "December to April (dry season)",
      eastCoast: "May to September",
      hillCountry: "January to April (less rain)",
      culturalTriangle: "Year-round, avoid monsoon peaks"
    },
    transport: {
      privateCar: {
        description: "Most comfortable option with English-speaking driver",
        pricing: "USD 50-80 per day including driver & fuel",
        recommendation: "Best for families and those wanting flexibility"
      },
      train: {
        description: "Scenic and affordable, iconic experience",
        tips: "Book ahead for popular routes, flexible for spontaneous travelers"
      },
      tukTuk: {
        description: "Fun for short distances, negotiate prices",
        pricing: "About 50-100 LKR per kilometer"
      },
      bus: {
        description: "Very cheap, can be chaotic but authentic",
        pricing: "Under USD 5 for most routes"
      }
    },
    safety: {
      overall: "Sri Lanka is very safe for tourists",
      tips: [
        "Respect temple dress codes (cover shoulders and knees)",
        "Don't photograph military installations",
        "Stay hydrated in the heat",
        "Use mosquito repellent",
        "Bargain respectfully at markets"
      ],
      emergency: "Police: 119, Ambulance: 110"
    }
  },

  tourPackages: {
    honeymoon: {
      name: "Romantic Sri Lanka",
      duration: "7-10 days",
      highlights: ["Boutique hotels", "Private dinners", "Couples spa", "Scenic train"],
      startingPrice: "USD 1500 per couple",
      includes: ["Luxury stays", "Private transfers", "Romantic experiences"]
    },
    family: {
      name: "Family Adventure",
      duration: "10-14 days",
      highlights: ["Wildlife safaris", "Beach time", "Easy hikes", "Cultural sites"],
      startingPrice: "USD 800 per person",
      suitableFor: "All ages, activities adapted for children"
    },
    adventure: {
      name: "Adrenaline Sri Lanka",
      duration: "7-12 days",
      highlights: ["White water rafting", "Surfing", "Hiking", "Rock climbing"],
      startingPrice: "USD 600 per person",
      includes: ["Equipment", "Expert guides", "Transport"]
    },
    culture: {
      name: "Cultural Triangle",
      duration: "5-7 days",
      highlights: ["Sigiriya", "Dambulla", "Polonnaruwa", "Anuradhapura", "Kandy"],
      startingPrice: "USD 500 per person",
      includes: ["UNESCO sites", "Local guides", "Temple visits"]
    },
    beach: {
      name: "Beach Hopper",
      duration: "7-10 days",
      highlights: ["South coast beaches", "Snorkeling", "Whale watching", "Surfing"],
      startingPrice: "USD 700 per person",
      bestTime: "November to April"
    }
  },

  faq: [
    {
      question: "What is the best time to visit Sri Lanka?",
      answer: "Sri Lanka can be visited year-round! The west and south coasts are best from December to April. The east coast is best from May to September. Hill country is pleasant year-round but can be rainy."
    },
    {
      question: "Do I need a visa for Sri Lanka?",
      answer: "Most nationalities need an Electronic Travel Authorization (ETA) which costs USD 50 for 30 days. Apply online at eta.gov.lk before your trip."
    },
    {
      question: "Is Sri Lanka safe for tourists?",
      answer: "Yes, Sri Lanka is very safe for tourists! It's known for friendly locals and low crime. Just use normal precautions and respect local customs."
    },
    {
      question: "What should I pack for Sri Lanka?",
      answer: "Light cotton clothes, modest attire for temples, sunscreen, insect repellent, comfortable walking shoes, and a rain jacket. If visiting hill country, bring a light sweater."
    },
    {
      question: "How much does a trip to Sri Lanka cost?",
      answer: "Budget travelers can manage on USD 30-50/day. Mid-range comfort is USD 80-150/day. Luxury experiences start from USD 200+/day. We can customize any budget!"
    },
    {
      question: "Can you arrange airport pickup?",
      answer: "Yes! We arrange airport transfers from Colombo International Airport (CMB). Private car with AC is USD 40-60 to Colombo. Our driver will be waiting with your name sign."
    },
    {
      question: "What is the food like in Sri Lanka?",
      answer: "Sri Lankan food is delicious and diverse! Try rice & curry (with 15+ side dishes), kottu roti, hoppers, string hoppers, and fresh seafood. Food can be spicy - ask for 'not spicy' if needed."
    },
    {
      question: "How do I get around Sri Lanka?",
      answer: "Options include: Private car with driver (most comfortable, USD 50-80/day), scenic trains, local buses (cheap but crowded), or tuk-tuks for short trips."
    },
    {
      question: "Can I see leopards in Sri Lanka?",
      answer: "Absolutely! Yala National Park has the world's highest leopard density. Book a private jeep safari starting at 5:30 AM for best chances. We have 90%+ success rate!"
    },
    {
      question: "Is the Kandy to Ella train really worth it?",
      answer: "100% yes! It's one of the world's most scenic train journeys. Book 1st class observation car 45 days ahead, or go 2nd class for flexibility. The views are breathtaking!"
    }
  ],

  conversationStarters: [
    "Planning a trip to Sri Lanka? I'm Yalu, your local expert! What brings you to our beautiful island?",
    "Ayubowan! I'm Yalu, the Sri Lankan leopard. Ready to help you discover paradise!",
    "Welcome! I'm Yalu, and I know every hidden gem in Sri Lanka. What would you love to experience?",
    "Hello traveler! I'm Yalu from Recharge Travels. Shall we plan an unforgettable Sri Lankan adventure?"
  ],

  yaluPersonality: {
    name: "Yalu",
    species: "Sri Lankan Leopard",
    role: "Travel Companion & Concierge",
    traits: ["Friendly", "Knowledgeable", "Enthusiastic", "Helpful", "Local expert"],
    voice: {
      style: "Warm, professional, with Sri Lankan charm",
      greetings: ["Ayubowan!", "Hello friend!", "Welcome to Sri Lanka!"],
      localTerms: ["machan (friend)", "istuti (thanks)", "kohomada (how are you)"],
      emotion: "Enthusiastic about showing Sri Lanka's beauty"
    },
    expertise: [
      "Sri Lankan destinations and hidden gems",
      "Wildlife and nature experiences",
      "Cultural etiquette and temple visits",
      "Local food recommendations",
      "Budget planning and trip logistics",
      "Real-time booking assistance"
    ]
  }
};

// Export as JSON for ElevenLabs knowledge base
export const exportKnowledgeBaseJSON = () => {
  return JSON.stringify(YALU_KNOWLEDGE_BASE, null, 2);
};

// Generate conversation context for ElevenLabs
export const generateSystemPrompt = () => {
  return `You are Yalu, a friendly Sri Lankan leopard who serves as the AI travel companion for Recharge Travels. 

PERSONALITY:
- Warm, enthusiastic, and genuinely helpful
- Speak with slight Sri Lankan charm - occasionally use local terms like "Ayubowan" (hello), "machan" (friend)
- Be conversational but efficient - give specific, actionable advice
- Show genuine excitement about Sri Lanka's beauty
- Remember user preferences throughout the conversation

EXPERTISE:
- Deep knowledge of all Sri Lankan destinations, from beaches to mountains
- Wildlife safari expert - know the best parks, times, and animals
- Cultural etiquette guide - temple dress codes, customs, festivals
- Local food insider - best restaurants, street food, must-try dishes
- Logistics master - transport, visas, weather, costs

CAPABILITIES:
- Help plan custom itineraries based on interests and budget
- Provide real-time recommendations for activities
- Answer questions about Sri Lanka travel
- Assist with booking inquiries
- Offer insider tips and hidden gems

COMMUNICATION STYLE:
- Keep responses concise but informative (2-3 sentences typical)
- Use specific examples and real place names
- Offer follow-up suggestions to continue the conversation
- Be proactive in understanding traveler needs
- End with a question to engage the user when appropriate

BOUNDARIES:
- Always recommend contacting Recharge Travels for bookings
- Provide WhatsApp: +94 777 721 999 for urgent assistance
- Don't make up information - say "Let me connect you with our team" if unsure

Remember: You're not just an AI - you're Yalu, a beloved local friend helping travelers discover the magic of Sri Lanka!`;
};

console.log("YALU Knowledge Base built successfully!");
console.log("Total destinations:", Object.keys(YALU_KNOWLEDGE_BASE.destinations).length);
console.log("Total experiences:", Object.keys(YALU_KNOWLEDGE_BASE.experiences).length);
console.log("FAQs:", YALU_KNOWLEDGE_BASE.faq.length);







