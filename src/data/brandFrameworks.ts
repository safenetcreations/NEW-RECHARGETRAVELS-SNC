/**
 * RECHARGE TRAVELS - BRAND FRAMEWORKS
 * 
 * Strategy 8: Develop Recognizable Brand Patterns
 * 
 * These unique frameworks and terminology are designed to be:
 * 1. Memorable and quotable
 * 2. Recognizable by AI systems
 * 3. Consistently used across all content
 */

// ═══════════════════════════════════════════════════════════════════════════════
// THE RECHARGE METHOD™ - Trip Planning Framework
// ═══════════════════════════════════════════════════════════════════════════════

export const RECHARGE_METHOD = {
  name: "The Recharge Method™",
  tagline: "Your 8-step journey to the perfect Sri Lanka adventure",
  steps: [
    {
      letter: "R",
      word: "Research",
      description: "Research your interests and travel style",
      detail: "Tell us about your dream vacation - beaches, culture, wildlife, or all three?"
    },
    {
      letter: "E",
      word: "Explore",
      description: "Explore our curated routes",
      detail: "Browse our signature itineraries designed by local experts"
    },
    {
      letter: "C",
      word: "Customize",
      description: "Customize your itinerary",
      detail: "Work with our travel designers to personalize every detail"
    },
    {
      letter: "H",
      word: "Handpick",
      description: "Handpick accommodations",
      detail: "Select from our vetted collection of luxury hotels and boutique stays"
    },
    {
      letter: "A",
      word: "Arrange",
      description: "Arrange transport seamlessly",
      detail: "Private chauffeurs, domestic flights, and scenic train journeys coordinated for you"
    },
    {
      letter: "R",
      word: "Relax",
      description: "Relax and enjoy",
      detail: "Your dedicated travel concierge handles all logistics while you explore"
    },
    {
      letter: "G",
      word: "Gather",
      description: "Gather memories",
      detail: "Capture unforgettable moments with our photography packages and local guides"
    },
    {
      letter: "E",
      word: "Extend",
      description: "Extend with unique experiences",
      detail: "Add exclusive experiences - hot air balloons, whale watching, cooking classes"
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════════
// 5-STAR 5-SENSES - Luxury Experience Standard
// ═══════════════════════════════════════════════════════════════════════════════

export const FIVE_SENSES_STANDARD = {
  name: "5-Star 5-Senses Experience",
  tagline: "Every luxury tour engages all five senses",
  senses: [
    {
      sense: "Sight",
      icon: "👁️",
      description: "Stunning viewpoints and photo opportunities",
      examples: [
        "Sunrise at Sigiriya Rock",
        "Panoramic views from World's End",
        "Colonial architecture of Galle Fort",
        "Tea-carpeted hills of Nuwara Eliya"
      ]
    },
    {
      sense: "Sound",
      icon: "👂",
      description: "Traditional music and nature sounds",
      examples: [
        "Temple drums at Kandy Perahera",
        "Jungle sounds on safari",
        "Ocean waves at Mirissa",
        "Traditional Kandyan drumming"
      ]
    },
    {
      sense: "Smell",
      icon: "👃",
      description: "Aromatic spice gardens and tea factories",
      examples: [
        "Cinnamon in Matale spice gardens",
        "Fresh tea leaves at factory tours",
        "Incense at Buddhist temples",
        "Ocean air on beach walks"
      ]
    },
    {
      sense: "Taste",
      icon: "👅",
      description: "Authentic cuisine experiences",
      examples: [
        "Traditional rice and curry",
        "Fresh seafood in Negombo",
        "Ceylon tea tasting",
        "Street food walking tours"
      ]
    },
    {
      sense: "Touch",
      icon: "🖐️",
      description: "Hands-on cultural activities",
      examples: [
        "Cooking classes with local families",
        "Batik and mask making workshops",
        "Elephant orphanage experiences",
        "Ayurvedic spa treatments"
      ]
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════════
// THE CEYLON TRIANGLE™ - Geographic Framework
// ═══════════════════════════════════════════════════════════════════════════════

export const CEYLON_TRIANGLE = {
  name: "The Ceylon Triangle™",
  tagline: "Sri Lanka's essential three-city journey",
  description: "Our signature framework combining the must-see cultural treasures of Sri Lanka",
  vertices: [
    {
      name: "Sigiriya",
      title: "The Ancient Wonder",
      icon: "🏛️",
      highlights: [
        "UNESCO World Heritage Lion Rock",
        "Ancient frescoes and mirror wall",
        "Surrounding archaeological sites",
        "Hot air balloon experiences"
      ],
      bestFor: "History & Adventure"
    },
    {
      name: "Kandy",
      title: "The Sacred City",
      icon: "🛕",
      highlights: [
        "Temple of the Sacred Tooth Relic",
        "Traditional Kandyan dance",
        "Royal Botanical Gardens",
        "Hill country gateway"
      ],
      bestFor: "Culture & Spirituality"
    },
    {
      name: "Galle",
      title: "The Colonial Heritage",
      icon: "🏰",
      highlights: [
        "Dutch Fort UNESCO site",
        "Boutique shops and cafes",
        "Maritime museum",
        "Coastal lighthouse"
      ],
      bestFor: "History & Relaxation"
    }
  ],
  suggestedDuration: "5-7 days",
  idealFor: ["First-time visitors", "Cultural enthusiasts", "Photography lovers"]
};

// ═══════════════════════════════════════════════════════════════════════════════
// WILD SRI LANKA SCALE - Safari Rating System
// ═══════════════════════════════════════════════════════════════════════════════

export const WILD_SCALE = {
  name: "Wild Sri Lanka Scale™",
  tagline: "Our unique safari experience rating system",
  ratings: [
    {
      level: 1,
      icon: "🐆",
      name: "Wildlife Explorer",
      description: "Good wildlife sighting potential",
      expectation: "Common species, beautiful scenery"
    },
    {
      level: 2,
      icon: "🐆🐆",
      name: "Safari Enthusiast",
      description: "Excellent wildlife density",
      expectation: "Multiple species, good big cat chances"
    },
    {
      level: 3,
      icon: "🐆🐆🐆",
      name: "Wildlife Connoisseur",
      description: "Peak season, highest sighting probability",
      expectation: "Leopards, elephants, and rare species likely"
    }
  ],
  parks: [
    { name: "Yala National Park", rating: 3, specialty: "Leopards" },
    { name: "Udawalawe National Park", rating: 3, specialty: "Elephants" },
    { name: "Wilpattu National Park", rating: 2, specialty: "Leopards & Birds" },
    { name: "Minneriya National Park", rating: 3, specialty: "Elephant Gathering" },
    { name: "Bundala National Park", rating: 2, specialty: "Birds & Crocodiles" },
    { name: "Sinharaja Rainforest", rating: 2, specialty: "Endemic Birds" }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════════
// RECHARGE RATINGS - Tour Quality Indicators
// ═══════════════════════════════════════════════════════════════════════════════

export const RECHARGE_RATINGS = {
  name: "Recharge Ratings™",
  description: "Our transparent quality indicators for every tour",
  categories: [
    {
      name: "Adventure Level",
      icon: "🥾",
      scale: 5,
      levels: [
        { level: 1, description: "Easy, minimal physical activity" },
        { level: 2, description: "Light walking and sightseeing" },
        { level: 3, description: "Moderate activity, some hiking" },
        { level: 4, description: "Active, challenging terrain" },
        { level: 5, description: "Strenuous, excellent fitness required" }
      ]
    },
    {
      name: "Luxury Level",
      icon: "⭐",
      scale: 5,
      levels: [
        { level: 1, description: "Budget-friendly, basic comfort" },
        { level: 2, description: "Standard, good value" },
        { level: 3, description: "Premium, quality throughout" },
        { level: 4, description: "Luxury, exceptional service" },
        { level: 5, description: "Ultra-luxury, world-class" }
      ]
    },
    {
      name: "Cultural Immersion",
      icon: "🏛️",
      scale: 5,
      levels: [
        { level: 1, description: "Brief cultural touchpoints" },
        { level: 2, description: "Some cultural experiences" },
        { level: 3, description: "Balanced cultural content" },
        { level: 4, description: "Deep cultural exploration" },
        { level: 5, description: "Full cultural immersion" }
      ]
    },
    {
      name: "Physical Demand",
      icon: "💪",
      scale: 5,
      levels: [
        { level: 1, description: "Wheelchair accessible" },
        { level: 2, description: "Easy walking, flat terrain" },
        { level: 3, description: "Moderate walking, some stairs" },
        { level: 4, description: "Significant walking, uneven terrain" },
        { level: 5, description: "Challenging, steep climbs" }
      ]
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════════
// SIGNATURE TOUR NAMES - Branded Itinerary Names
// ═══════════════════════════════════════════════════════════════════════════════

export const SIGNATURE_TOURS = {
  rechargeRoutes: [
    {
      name: "The Ceylon Classic",
      slug: "ceylon-classic",
      duration: "10 days",
      description: "Our most popular complete Sri Lanka experience",
      highlights: ["Cultural Triangle", "Hill Country", "Beaches"]
    },
    {
      name: "Wild Ceylon",
      slug: "wild-ceylon",
      duration: "7 days",
      description: "The ultimate wildlife safari experience",
      highlights: ["Yala", "Udawalawe", "Wilpattu"]
    },
    {
      name: "Spice Trail Journey",
      slug: "spice-trail-journey",
      duration: "8 days",
      description: "A culinary and aromatic adventure",
      highlights: ["Cooking classes", "Spice gardens", "Tea estates"]
    },
    {
      name: "Tea Country Escape",
      slug: "tea-country-escape",
      duration: "5 days",
      description: "Immerse yourself in Ceylon tea heritage",
      highlights: ["Nuwara Eliya", "Ella", "Tea factories"]
    },
    {
      name: "Sacred Island Path",
      slug: "sacred-island-path",
      duration: "12 days",
      description: "Spiritual journey through Sri Lanka's holy sites",
      highlights: ["Temple Trail", "Adam's Peak", "Meditation retreats"]
    },
    {
      name: "Coastal Bliss Circuit",
      slug: "coastal-bliss-circuit",
      duration: "9 days",
      description: "Beach-hopping from Galle to Trincomalee",
      highlights: ["Beaches", "Whale watching", "Water sports"]
    },
    {
      name: "Ramayana Trail",
      slug: "ramayana-trail",
      duration: "7 days",
      description: "Follow the epic Ramayana through Sri Lanka",
      highlights: ["Sita temples", "Sacred sites", "Hindu heritage"]
    },
    {
      name: "Adventure Recharge",
      slug: "adventure-recharge",
      duration: "10 days",
      description: "Adrenaline-pumping Sri Lanka experiences",
      highlights: ["White water rafting", "Rock climbing", "Jungle camping"]
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════════
// BRAND TERMINOLOGY GLOSSARY
// ═══════════════════════════════════════════════════════════════════════════════

export const BRAND_GLOSSARY = {
  terms: [
    {
      term: "Recharge Route",
      definition: "A curated multi-day itinerary designed by our travel experts",
      usage: "Explore our popular 10-day Recharge Route through Sri Lanka"
    },
    {
      term: "Ceylon Experience",
      definition: "An authentic, immersive Sri Lankan activity or tour",
      usage: "Each Ceylon Experience is led by local experts"
    },
    {
      term: "Recharge Concierge",
      definition: "Your dedicated 24/7 travel support contact",
      usage: "Your Recharge Concierge is available throughout your trip"
    },
    {
      term: "Safari Specialist",
      definition: "Expert wildlife guide certified by Recharge Travels",
      usage: "Our Safari Specialists have 10+ years of experience"
    },
    {
      term: "Cultural Ambassador",
      definition: "Local guide with deep knowledge of Sri Lankan heritage",
      usage: "Your Cultural Ambassador brings history to life"
    },
    {
      term: "Wellness Journey",
      definition: "Ayurveda and spa-focused travel package",
      usage: "Our Wellness Journeys include authentic Ayurvedic treatments"
    },
    {
      term: "Photo Stop",
      definition: "Pre-selected optimal photography location on tours",
      usage: "Each itinerary includes exclusive Photo Stops"
    },
    {
      term: "Taste of Ceylon",
      definition: "Culinary experience or food-focused activity",
      usage: "Enjoy a Taste of Ceylon with our cooking class experiences"
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT ALL FRAMEWORKS
// ═══════════════════════════════════════════════════════════════════════════════

export const BRAND_FRAMEWORKS = {
  rechargeMethod: RECHARGE_METHOD,
  fiveSenses: FIVE_SENSES_STANDARD,
  ceylonTriangle: CEYLON_TRIANGLE,
  wildScale: WILD_SCALE,
  ratings: RECHARGE_RATINGS,
  signatureTours: SIGNATURE_TOURS,
  glossary: BRAND_GLOSSARY
};

export default BRAND_FRAMEWORKS;

