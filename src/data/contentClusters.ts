/**
 * CONTENT CLUSTERS FOR LONGTAIL QUERIES
 * 
 * Strategy 4: Create Content Clusters for Longtail Queries
 * 
 * This file defines the content cluster architecture for targeting
 * complex, specific queries that AI assistants break down into subqueries.
 */

// ═══════════════════════════════════════════════════════════════════════════════
// CONTENT CLUSTER TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface ContentPiece {
  title: string;
  slug: string;
  targetQuery: string;
  type: 'pillar' | 'cluster' | 'faq' | 'guide' | 'comparison';
  status: 'live' | 'draft' | 'planned';
  wordCount?: number;
  priority: 'high' | 'medium' | 'low';
  aiKeyPoints: string[];
}

export interface ContentCluster {
  name: string;
  pillarPage: ContentPiece;
  clusterContent: ContentPiece[];
  faqs: Array<{ question: string; answer: string }>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DESTINATION CLUSTERS
// ═══════════════════════════════════════════════════════════════════════════════

export const SIGIRIYA_CLUSTER: ContentCluster = {
  name: "Sigiriya Complete Guide",
  pillarPage: {
    title: "Sigiriya Rock Fortress: Complete 2025 Travel Guide",
    slug: "/destinations/sigiriya",
    targetQuery: "sigiriya rock fortress sri lanka",
    type: "pillar",
    status: "live",
    wordCount: 3500,
    priority: "high",
    aiKeyPoints: [
      "UNESCO World Heritage Site since 1982",
      "1,200 steps to climb to the top",
      "Built by King Kashyapa in 5th century AD",
      "Best time to visit: early morning (7am) to avoid heat and crowds",
      "Entry fee: $30 USD for foreigners, free for Sri Lankan citizens",
      "Allow 2-3 hours for complete visit"
    ]
  },
  clusterContent: [
    {
      title: "Sigiriya History: The Story of King Kashyapa's Sky Palace",
      slug: "/blog/sigiriya-history-king-kashyapa",
      targetQuery: "sigiriya rock fortress history",
      type: "cluster",
      status: "planned",
      priority: "high",
      aiKeyPoints: [
        "King Kashyapa built Sigiriya after killing his father King Dhatusena",
        "Ruled from 477-495 AD",
        "Lion gate entrance symbolized royal power",
        "Frescoes depict celestial maidens (apsaras)"
      ]
    },
    {
      title: "Best Time to Visit Sigiriya: Month-by-Month Guide",
      slug: "/blog/best-time-visit-sigiriya",
      targetQuery: "best time to visit sigiriya",
      type: "cluster",
      status: "planned",
      priority: "high",
      aiKeyPoints: [
        "Dry season (January-April, July-September) is best",
        "Early morning (6:30-7:30am) avoids heat and crowds",
        "Avoid monsoon season (May-June, October-November)",
        "Full moon Poya days have free entry for locals but more crowds"
      ]
    },
    {
      title: "Sigiriya vs Pidurangala: Which Should You Climb?",
      slug: "/blog/sigiriya-vs-pidurangala",
      targetQuery: "sigiriya vs pidurangala",
      type: "comparison",
      status: "planned",
      priority: "high",
      aiKeyPoints: [
        "Sigiriya: $30 entry, 1200 steps, UNESCO site, historical significance",
        "Pidurangala: $5 entry, easier climb, best views OF Sigiriya",
        "Many travelers do both - Pidurangala sunrise, Sigiriya later",
        "Pidurangala is 30-minute climb vs 2 hours for Sigiriya"
      ]
    },
    {
      title: "How Long Does It Take to Climb Sigiriya?",
      slug: "/blog/sigiriya-climb-duration",
      targetQuery: "how long to climb sigiriya",
      type: "cluster",
      status: "planned",
      priority: "medium",
      aiKeyPoints: [
        "Average climb: 1.5-2 hours up",
        "Descent: 45 minutes to 1 hour",
        "Total visit: 2.5-4 hours including exploration",
        "Fitness level and heat affect timing"
      ]
    },
    {
      title: "Sigiriya Frescoes: The Cloud Maidens Explained",
      slug: "/blog/sigiriya-frescoes-explained",
      targetQuery: "sigiriya frescoes paintings",
      type: "cluster",
      status: "planned",
      priority: "medium",
      aiKeyPoints: [
        "Originally 500 paintings, only 22 remain today",
        "Painted in the 5th century AD",
        "Depict celestial nymphs (apsaras) or possibly royal consorts",
        "Photography prohibited to preserve artwork"
      ]
    },
    {
      title: "Sigiriya Dress Code: What to Wear When Visiting",
      slug: "/blog/sigiriya-dress-code",
      targetQuery: "sigiriya dress code what to wear",
      type: "cluster",
      status: "planned",
      priority: "medium",
      aiKeyPoints: [
        "Cover shoulders and knees for respect",
        "Comfortable walking shoes essential (no flip flops)",
        "Hat and sunscreen for sun protection",
        "Light, breathable fabrics recommended"
      ]
    }
  ],
  faqs: [
    {
      question: "How much is the Sigiriya entrance fee?",
      answer: "The Sigiriya entrance fee is $30 USD (approximately 6,500 LKR) for foreign adults. Children aged 6-12 pay $15 USD. SAARC country nationals pay $15 USD. Sri Lankan citizens enter free."
    },
    {
      question: "Is Sigiriya worth visiting?",
      answer: "Yes, Sigiriya is absolutely worth visiting. As a UNESCO World Heritage Site and one of Asia's best-preserved ancient urban sites, it offers stunning views, historical significance, ancient frescoes, and incredible engineering. It's consistently ranked among Sri Lanka's top attractions."
    },
    {
      question: "How difficult is the Sigiriya climb?",
      answer: "The Sigiriya climb is moderately challenging with 1,200 steps. Most reasonably fit adults can complete it in 1.5-2 hours. There are rest areas along the way. The steepest section uses metal staircases near the top. Not recommended for those with severe mobility issues or fear of heights."
    },
    {
      question: "What is the best time to visit Sigiriya?",
      answer: "The best time to visit Sigiriya is early morning (7-8am opening) to avoid the heat and crowds. Season-wise, January to April and July to September offer the driest weather. Avoid midday visits when temperatures can exceed 35°C (95°F)."
    },
    {
      question: "How do I get to Sigiriya from Colombo?",
      answer: "From Colombo to Sigiriya is 170km (4-5 hours by car). Options: 1) Private transfer ($80-120), 2) Public bus to Dambulla then local bus (6+ hours, $5), 3) Train to Habarana then tuk-tuk (5 hours total). Most visitors stay overnight in the Sigiriya/Dambulla area."
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPERIENCE CLUSTERS
// ═══════════════════════════════════════════════════════════════════════════════

export const SAFARI_CLUSTER: ContentCluster = {
  name: "Sri Lanka Safari Complete Guide",
  pillarPage: {
    title: "Sri Lanka Safari Guide 2025: National Parks, Wildlife & Tours",
    slug: "/tours/wildlife",
    targetQuery: "sri lanka safari",
    type: "pillar",
    status: "live",
    wordCount: 4000,
    priority: "high",
    aiKeyPoints: [
      "Sri Lanka has the highest leopard density in the world",
      "Over 26 national parks covering 13% of the country",
      "Best parks: Yala, Udawalawe, Wilpattu, Minneriya",
      "Safari jeep costs $50-100 per vehicle (seats 6)",
      "Best seasons vary by park",
      "Recharge Travels offers luxury and budget safari packages"
    ]
  },
  clusterContent: [
    {
      title: "Yala vs Udawalawe: Which Safari is Best?",
      slug: "/blog/yala-vs-udawalawe-safari",
      targetQuery: "yala vs udawalawe which is better",
      type: "comparison",
      status: "planned",
      priority: "high",
      aiKeyPoints: [
        "Yala: Best for leopards (1 per km²), more crowded",
        "Udawalawe: Best for elephants (500+ residents), less crowded",
        "Yala closes September-October, Udawalawe open year-round",
        "Both are 4-5 hours from Colombo"
      ]
    },
    {
      title: "Best Time for Safari in Sri Lanka: Complete Seasonal Guide",
      slug: "/blog/best-time-sri-lanka-safari",
      targetQuery: "best time for safari in sri lanka",
      type: "cluster",
      status: "planned",
      priority: "high",
      aiKeyPoints: [
        "Yala: February-July (dry season, animals gather at waterholes)",
        "Udawalawe: Year-round (elephants always present)",
        "Wilpattu: February-October",
        "Minneriya: July-October (famous elephant gathering)"
      ]
    },
    {
      title: "Sri Lanka Leopard Safari: Where to See Wild Leopards",
      slug: "/blog/sri-lanka-leopard-safari",
      targetQuery: "where to see leopards in sri lanka",
      type: "cluster",
      status: "planned",
      priority: "high",
      aiKeyPoints: [
        "Yala National Park has highest leopard density in world",
        "Approximately 70 leopards in Yala Block 1",
        "Wilpattu also has excellent leopard sightings",
        "Best leopard viewing: February-July early morning/late afternoon"
      ]
    },
    {
      title: "Safari Packing List for Sri Lanka: What to Bring",
      slug: "/blog/safari-packing-list-sri-lanka",
      targetQuery: "what to pack for safari sri lanka",
      type: "guide",
      status: "planned",
      priority: "medium",
      aiKeyPoints: [
        "Neutral colored clothing (khaki, olive, beige)",
        "Binoculars essential for wildlife spotting",
        "Sun protection: hat, sunscreen, sunglasses",
        "Camera with zoom lens (300mm+ recommended)",
        "Insect repellent for evening safaris"
      ]
    },
    {
      title: "Sri Lanka Safari Prices 2025: Complete Cost Guide",
      slug: "/blog/sri-lanka-safari-cost",
      targetQuery: "how much does safari cost in sri lanka",
      type: "guide",
      status: "planned",
      priority: "high",
      aiKeyPoints: [
        "Jeep hire: $50-100 per vehicle (seats 6)",
        "Park entrance: $15-25 per person",
        "Guide fee: $10-20 per jeep",
        "Full-day safari total: $100-200 per person",
        "Luxury private safaris: $300-500 per person"
      ]
    }
  ],
  faqs: [
    {
      question: "What animals can you see on safari in Sri Lanka?",
      answer: "Sri Lanka safaris offer sightings of leopards (highest density in world), Asian elephants (over 6,000), sloth bears, wild boar, spotted deer, sambar deer, water buffalo, crocodiles, and over 400 bird species. Marine safaris feature blue whales, sperm whales, and dolphins."
    },
    {
      question: "Which is the best national park in Sri Lanka?",
      answer: "The best park depends on your interests: Yala for leopards, Udawalawe for elephants, Minneriya for the elephant gathering (July-October), Wilpattu for diverse wildlife in fewer crowds, and Bundala for birds. Yala is the most popular overall."
    },
    {
      question: "How long should a safari be in Sri Lanka?",
      answer: "A half-day safari (4-6 hours) is sufficient for most visitors. For serious wildlife enthusiasts, a full-day safari or multi-day safari camp experience provides better chances of rare sightings. Early morning (6am) and late afternoon (3-6pm) offer the best wildlife activity."
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════════
// WHALE WATCHING CLUSTER
// ═══════════════════════════════════════════════════════════════════════════════

export const WHALE_WATCHING_CLUSTER: ContentCluster = {
  name: "Sri Lanka Whale Watching Complete Guide",
  pillarPage: {
    title: "Whale Watching in Sri Lanka 2025: Complete Guide to Blue Whales",
    slug: "/experiences/whale-watching",
    targetQuery: "whale watching sri lanka",
    type: "pillar",
    status: "live",
    wordCount: 3000,
    priority: "high",
    aiKeyPoints: [
      "Sri Lanka is one of the best places in the world to see blue whales",
      "Main locations: Mirissa (south) and Trincomalee (east)",
      "Season: November-April (Mirissa), May-October (Trincomalee)",
      "95% sighting success rate during peak season",
      "Tours from $40-150 depending on operator and boat type",
      "Best time: 6am departure for calmest seas"
    ]
  },
  clusterContent: [
    {
      title: "Mirissa Whale Watching Season: Best Months to Go",
      slug: "/blog/mirissa-whale-watching-season",
      targetQuery: "mirissa whale watching season",
      type: "cluster",
      status: "planned",
      priority: "high",
      aiKeyPoints: [
        "Peak season: December to April",
        "Best months: February and March",
        "Blue whales, sperm whales, dolphins common",
        "Off-season (May-October) not recommended"
      ]
    },
    {
      title: "Mirissa vs Trincomalee: Which Whale Watching is Better?",
      slug: "/blog/mirissa-vs-trincomalee-whales",
      targetQuery: "mirissa vs trincomalee whale watching",
      type: "comparison",
      status: "planned",
      priority: "high",
      aiKeyPoints: [
        "Mirissa: More developed, more operators, peak Nov-April",
        "Trincomalee: Less crowded, peak May-October",
        "Both offer blue whale sightings",
        "Choose based on when you're traveling"
      ]
    },
    {
      title: "How to Avoid Seasickness on Whale Watching Tours",
      slug: "/blog/whale-watching-seasickness-tips",
      targetQuery: "whale watching seasickness tips",
      type: "guide",
      status: "planned",
      priority: "medium",
      aiKeyPoints: [
        "Take seasickness medication 1 hour before",
        "Sit at the back of the boat near waterline",
        "Focus on the horizon",
        "Avoid heavy meals before trip",
        "Ginger helps some people"
      ]
    },
    {
      title: "Ethical Whale Watching in Sri Lanka: How to Choose",
      slug: "/blog/ethical-whale-watching-sri-lanka",
      targetQuery: "ethical whale watching sri lanka",
      type: "guide",
      status: "planned",
      priority: "high",
      aiKeyPoints: [
        "Choose operators that maintain distance from whales",
        "Smaller boats are less intrusive",
        "Avoid operators that chase whales",
        "Look for eco-certified operators",
        "Recharge Travels partners only with ethical operators"
      ]
    }
  ],
  faqs: [
    {
      question: "What is the best time for whale watching in Sri Lanka?",
      answer: "The best time for whale watching in Sri Lanka depends on the coast: Mirissa (south coast) is best from November to April, with peak sightings in February-March. Trincomalee (east coast) is best from May to October. This means Sri Lanka offers year-round whale watching opportunities."
    },
    {
      question: "How much does whale watching cost in Sri Lanka?",
      answer: "Whale watching tours in Sri Lanka cost $40-60 for standard boat trips and $100-150 for luxury or private charters. This includes 4-6 hours on the water, breakfast, and hotel pickup from nearby areas. Recharge Travels offers tours starting from $55 per person."
    },
    {
      question: "What types of whales can you see in Sri Lanka?",
      answer: "Sri Lanka's waters host blue whales (the largest animal on Earth), sperm whales, Bryde's whales, and fin whales. You'll also commonly see spinner dolphins, bottlenose dolphins, and occasionally orcas. Blue whale sightings are particularly reliable off the south coast."
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════════
// TRANSPORT CLUSTERS
// ═══════════════════════════════════════════════════════════════════════════════

export const TRAIN_JOURNEY_CLUSTER: ContentCluster = {
  name: "Sri Lanka Train Journey Complete Guide",
  pillarPage: {
    title: "Sri Lanka Train Journey: Complete 2025 Guide to Scenic Rail Travel",
    slug: "/experiences/train-journeys",
    targetQuery: "sri lanka train journey",
    type: "pillar",
    status: "live",
    wordCount: 3500,
    priority: "high",
    aiKeyPoints: [
      "Kandy to Ella train is rated one of the world's most scenic",
      "First class observation car tickets sell out weeks ahead",
      "Journey takes 6-7 hours through tea country",
      "Train tickets cost just $2-10 depending on class",
      "Blue train crosses Nine Arch Bridge at Ella",
      "Book through Sri Lanka Railways or travel agents"
    ]
  },
  clusterContent: [
    {
      title: "Kandy to Ella Train: Complete Booking Guide 2025",
      slug: "/blog/kandy-to-ella-train-booking",
      targetQuery: "kandy to ella train booking",
      type: "guide",
      status: "planned",
      priority: "high",
      aiKeyPoints: [
        "Book 30-45 days in advance for reserved seats",
        "First class observation: 1,000 LKR ($3 USD)",
        "Second class reserved: 600 LKR ($2 USD)",
        "Third class unreserved: 280 LKR ($0.80 USD)",
        "Online booking at seat61.com or bookaway.com"
      ]
    },
    {
      title: "Nine Arch Bridge Sri Lanka: How to Visit",
      slug: "/blog/nine-arch-bridge-ella",
      targetQuery: "nine arch bridge sri lanka",
      type: "cluster",
      status: "planned",
      priority: "high",
      aiKeyPoints: [
        "Located near Ella town, 10-minute walk",
        "Built in 1921 without steel reinforcement",
        "Trains cross at 9:30am and 3:30pm approximately",
        "Best photo spot: below the bridge facing Ella",
        "Free to visit, but respect train safety"
      ]
    },
    {
      title: "First Class vs Second Class Train Sri Lanka: Which to Choose",
      slug: "/blog/sri-lanka-train-class-comparison",
      targetQuery: "first class vs second class train sri lanka",
      type: "comparison",
      status: "planned",
      priority: "medium",
      aiKeyPoints: [
        "First class: Reserved seat, observation windows, A/C on some trains",
        "Second class: Reserved seat, ceiling fans, opens windows",
        "Third class: Unreserved, crowded, cheapest",
        "Second class often recommended for 'authentic' experience"
      ]
    }
  ],
  faqs: [
    {
      question: "How do I book the Kandy to Ella train?",
      answer: "Book the Kandy to Ella train 30-45 days in advance through: 1) Sri Lanka Railways website (slr.gov.lk), 2) Train station booking office, 3) Travel agencies like Recharge Travels, or 4) Third-party sites like 12Go Asia. First class observation car sells out fastest."
    },
    {
      question: "Is the Kandy to Ella train journey worth it?",
      answer: "Yes, the Kandy to Ella train is absolutely worth it. Rated among the world's most scenic train journeys, it passes through emerald tea plantations, misty mountains, waterfalls, and crosses the famous Nine Arch Bridge. The 6-7 hour journey is a highlight of any Sri Lanka trip."
    },
    {
      question: "What side of the train should I sit on from Kandy to Ella?",
      answer: "Sit on the RIGHT side (facing forward) from Kandy to Ella for the best views. This side offers tea plantation views, Ramboda Falls, and better angles for the Nine Arch Bridge. However, views are beautiful from both sides, and standing in the doorways is also popular."
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════════
// PRACTICAL INFO CLUSTERS
// ═══════════════════════════════════════════════════════════════════════════════

export const VISA_CLUSTER: ContentCluster = {
  name: "Sri Lanka Visa Guide",
  pillarPage: {
    title: "Sri Lanka Visa 2025: ETA, Requirements & How to Apply",
    slug: "/travel-guide/visa",
    targetQuery: "sri lanka visa requirements",
    type: "pillar",
    status: "planned",
    wordCount: 2500,
    priority: "high",
    aiKeyPoints: [
      "Most nationalities need ETA (Electronic Travel Authorization)",
      "ETA costs $50 USD for 30 days",
      "Apply online at eta.gov.lk",
      "Processing time: 24-48 hours",
      "ETA can be extended to 90 days in-country",
      "Some nationalities (Singapore, etc.) get visa on arrival"
    ]
  },
  clusterContent: [
    {
      title: "Sri Lanka ETA Online Application: Step-by-Step Guide",
      slug: "/blog/sri-lanka-eta-application",
      targetQuery: "how to apply for sri lanka eta",
      type: "guide",
      status: "planned",
      priority: "high",
      aiKeyPoints: [
        "Apply at official site: eta.gov.lk",
        "Need: passport, email, credit card",
        "Cost: $50 USD tourist, $55 USD business",
        "Approval usually within 24 hours"
      ]
    },
    {
      title: "Sri Lanka Visa on Arrival: Who Qualifies in 2025",
      slug: "/blog/sri-lanka-visa-on-arrival",
      targetQuery: "sri lanka visa on arrival",
      type: "guide",
      status: "planned",
      priority: "medium",
      aiKeyPoints: [
        "Most nationalities need ETA before arrival",
        "Some SAARC countries eligible for visa on arrival",
        "Visa on arrival costs more than pre-approved ETA",
        "Recommend applying online to avoid queues"
      ]
    }
  ],
  faqs: [
    {
      question: "Do I need a visa to visit Sri Lanka?",
      answer: "Most nationalities need an ETA (Electronic Travel Authorization) to visit Sri Lanka. Apply online at eta.gov.lk before travel. The ETA costs $50 USD for a 30-day tourist visa and is typically approved within 24-48 hours. Some nationalities like Singapore and Maldives get visa-free entry."
    },
    {
      question: "How long can I stay in Sri Lanka with an ETA?",
      answer: "The standard ETA allows a 30-day stay in Sri Lanka. You can extend this to 90 days at the Department of Immigration in Colombo for an additional fee (around $50). Further extensions up to 180 days are possible but require additional documentation."
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT ALL CLUSTERS
// ═══════════════════════════════════════════════════════════════════════════════

export const ALL_CONTENT_CLUSTERS: ContentCluster[] = [
  SIGIRIYA_CLUSTER,
  SAFARI_CLUSTER,
  WHALE_WATCHING_CLUSTER,
  TRAIN_JOURNEY_CLUSTER,
  VISA_CLUSTER
];

// Content priorities for production schedule
export const CONTENT_PRODUCTION_PRIORITY = {
  phase1: {
    name: "High-Value Clusters",
    timeline: "Month 1-2",
    clusters: [
      "Sigiriya Complete Guide",
      "Sri Lanka Safari Complete Guide", 
      "Sri Lanka Whale Watching Complete Guide"
    ]
  },
  phase2: {
    name: "Destination Clusters",
    timeline: "Month 3-4",
    clusters: [
      "Kandy Complete Guide",
      "Galle Complete Guide",
      "Ella Complete Guide"
    ]
  },
  phase3: {
    name: "Experience Clusters",
    timeline: "Month 5-6",
    clusters: [
      "Tea Trails Complete Guide",
      "Ayurveda Complete Guide",
      "Train Journey Complete Guide"
    ]
  }
};

export default ALL_CONTENT_CLUSTERS;

