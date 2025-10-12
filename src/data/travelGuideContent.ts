export interface GuideSection {
  id: string;
  title: string;
  content: string;
  images?: string[];
  tips?: string[];
  highlights?: string[];
}

export interface GuideCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  sections: GuideSection[];
  printable: boolean;
}

export const travelGuideCategories: GuideCategory[] = [
  {
    id: 'destinations',
    name: 'Popular Destinations',
    icon: '🏖️',
    description: 'Explore Sri Lanka\'s most iconic destinations',
    printable: true,
    sections: [
      {
        id: 'colombo',
        title: 'Colombo - The Commercial Capital',
        content: `Colombo, Sri Lanka's bustling commercial capital, offers a perfect blend of modern city life and colonial charm. Key attractions include the Galle Face Green, National Museum, Gangaramaya Temple, and vibrant Pettah Market.`,
        highlights: [
          'Galle Face Green - oceanside urban park',
          'National Museum - Sri Lankan heritage',
          'Gangaramaya Temple - Buddhist architecture',
          'Pettah Market - local shopping experience',
          'Dutch Hospital - colonial era shopping precinct'
        ],
        tips: [
          'Best time to visit: Year-round destination',
          'Use tuk-tuks for short distances',
          'Try street food at Galle Face Green',
          'Visit temples early morning to avoid crowds'
        ]
      },
      {
        id: 'kandy',
        title: 'Kandy - The Cultural Capital',
        content: `Kandy, the last capital of ancient Sri Lankan kings, is home to the sacred Temple of the Tooth Relic. This UNESCO World Heritage city is surrounded by mountains, tea plantations, and tropical plantations.`,
        highlights: [
          'Temple of the Tooth - Buddhist sacred site',
          'Kandy Lake - scenic walkway',
          'Royal Botanical Gardens - tropical flora',
          'Traditional Kandyan Dance shows',
          'Tea plantations and factories'
        ],
        tips: [
          'Attend the evening puja at Temple of Tooth',
          'Book accommodation with lake views',
          'Visit during Kandy Esala Perahera (July/August)',
          'Dress modestly for temple visits'
        ]
      },
      {
        id: 'galle',
        title: 'Galle - The Dutch Fort City',
        content: `Galle Fort, a UNESCO World Heritage Site, showcases the best-preserved colonial architecture in Asia. Walk along the fort walls, explore boutique shops, and enjoy sunset views over the Indian Ocean.`,
        highlights: [
          'Galle Fort - 17th century Dutch fortification',
          'Lighthouse and fort walls walk',
          'Maritime Archaeological Museum',
          'Boutique shops and cafes',
          'Unawatuna Beach nearby'
        ],
        tips: [
          'Best visited early morning or late afternoon',
          'Stay inside the fort for authentic experience',
          'Join a guided walking tour',
          'Visit during Galle Literary Festival (January)'
        ]
      }
    ]
  },
  {
    id: 'wildlife',
    name: 'Wildlife & Safari',
    icon: '🐘',
    description: 'Wildlife watching and safari experiences',
    printable: true,
    sections: [
      {
        id: 'yala',
        title: 'Yala National Park',
        content: `Yala National Park has the highest density of leopards in the world. Besides leopards, the park is home to elephants, sloth bears, crocodiles, and over 200 bird species.`,
        highlights: [
          'Highest leopard density globally',
          'Asian elephants and sloth bears',
          'Over 215 bird species',
          'Coastal lagoons and beaches',
          'Ancient Buddhist ruins'
        ],
        tips: [
          'Book morning safari for best wildlife sightings',
          'Closed in September for maintenance',
          'Stay at border hotels for early entry',
          'Bring binoculars and camera with zoom lens'
        ]
      },
      {
        id: 'udawalawe',
        title: 'Udawalawe National Park',
        content: `Udawalawe is famous for its large elephant population, with over 600 elephants roaming freely. The park also features the Elephant Transit Home where orphaned elephants are rehabilitated.`,
        highlights: [
          '600+ wild elephants',
          'Elephant Transit Home',
          'Water birds and raptors',
          'Udawalawe Reservoir',
          'Open grasslands for easy viewing'
        ],
        tips: [
          'Visit Elephant Transit Home at feeding times',
          'Best visited May to September',
          'Full-day safaris recommended',
          'Less crowded than Yala'
        ]
      },
      {
        id: 'whale-watching',
        title: 'Whale & Dolphin Watching',
        content: `Sri Lanka offers world-class whale watching with blue whales, sperm whales, and dolphins. Mirissa (November-April) and Trincomalee (May-October) are the main whale watching destinations.`,
        highlights: [
          'Blue whales - largest animals on earth',
          'Sperm whales and fin whales',
          'Spinner and bottlenose dolphins',
          'Seasonal migration patterns',
          'Responsible whale watching tours'
        ],
        tips: [
          'Book with responsible operators',
          'Take seasickness medication',
          'Early morning tours best',
          'Bring sun protection and water'
        ]
      }
    ]
  },
  {
    id: 'beaches',
    name: 'Beaches & Coastal',
    icon: '🏝️',
    description: 'Sun, sand, and surf destinations',
    printable: true,
    sections: [
      {
        id: 'south-coast',
        title: 'Southern Beaches',
        content: `The south coast offers year-round sunshine with beaches ranging from surfing hotspots to tranquil bays. Popular beaches include Unawatuna, Mirissa, Tangalle, and Weligama.`,
        highlights: [
          'Unawatuna - swimming and snorkeling',
          'Mirissa - whale watching hub',
          'Weligama - learn to surf',
          'Tangalle - secluded beaches',
          'Hiriketiya - surfer\'s paradise'
        ],
        tips: [
          'Best weather: November to April',
          'Book beachfront accommodation early',
          'Try fresh seafood at beach restaurants',
          'Respect local customs when swimming'
        ]
      },
      {
        id: 'east-coast',
        title: 'Eastern Beaches',
        content: `The east coast beaches are perfect from May to September when the west and south experience monsoons. Arugam Bay, Pasikudah, and Nilaveli offer pristine beaches and water sports.`,
        highlights: [
          'Arugam Bay - world-class surfing',
          'Pasikudah - shallow calm waters',
          'Nilaveli - white sand beaches',
          'Pigeon Island - snorkeling',
          'Less touristy atmosphere'
        ],
        tips: [
          'Best weather: May to September',
          'Arugam Bay surf season: April to October',
          'Book transportation in advance',
          'Limited ATMs - carry cash'
        ]
      }
    ]
  },
  {
    id: 'culture',
    name: 'Culture & Heritage',
    icon: '🛕',
    description: 'Ancient cities and cultural experiences',
    printable: true,
    sections: [
      {
        id: 'cultural-triangle',
        title: 'The Cultural Triangle',
        content: `The Cultural Triangle encompasses ancient capitals of Anuradhapura, Polonnaruwa, and the rock fortress of Sigiriya. This UNESCO World Heritage region showcases 2,500 years of Sri Lankan civilization.`,
        highlights: [
          'Sigiriya Rock Fortress - 5th century palace',
          'Dambulla Cave Temple - Buddhist art',
          'Anuradhapura - ancient sacred city',
          'Polonnaruwa - medieval capital',
          'Mihintale - birthplace of Buddhism in Sri Lanka'
        ],
        tips: [
          'Start early to avoid heat and crowds',
          'Hire licensed guides for historical context',
          'Dress modestly with covered shoulders/knees',
          'Carry water and sun protection'
        ]
      },
      {
        id: 'tea-country',
        title: 'Hill Country & Tea Estates',
        content: `The central highlands offer cool climate, rolling tea plantations, and colonial charm. Visit Nuwara Eliya, Ella, and Haputale for scenic train rides and tea factory tours.`,
        highlights: [
          'Scenic train ride to Ella',
          'Tea factory tours and tastings',
          'Horton Plains National Park',
          'Adam\'s Peak pilgrimage',
          'Colonial architecture in Nuwara Eliya'
        ],
        tips: [
          'Book train tickets in advance',
          'Pack warm clothes for cool evenings',
          'Best weather: December to April',
          'Try fresh tea at the source'
        ]
      }
    ]
  },
  {
    id: 'activities',
    name: 'Activities & Adventures',
    icon: '🎯',
    description: 'Adventure sports and activities',
    printable: true,
    sections: [
      {
        id: 'water-sports',
        title: 'Water Sports & Activities',
        content: `Sri Lanka\'s coastline and rivers offer diverse water sports including surfing, diving, snorkeling, white water rafting, and kitesurfing.`,
        highlights: [
          'Surfing - Arugam Bay, Weligama, Mirissa',
          'Diving - Hikkaduwa, Trincomalee, Batticaloa',
          'White water rafting - Kitulgala',
          'Kitesurfing - Kalpitiya',
          'Stand-up paddleboarding - various locations'
        ],
        tips: [
          'Check seasonal conditions for each activity',
          'Use certified operators for safety',
          'Beginner lessons widely available',
          'Bring reef-safe sunscreen'
        ]
      },
      {
        id: 'trekking',
        title: 'Hiking & Trekking',
        content: `From challenging mountain peaks to gentle nature walks, Sri Lanka offers trails for all fitness levels through diverse landscapes.`,
        highlights: [
          'Adam\'s Peak - sacred pilgrimage',
          'Knuckles Mountain Range - biodiversity',
          'Ella Rock - panoramic views',
          'Horton Plains - World\'s End cliff',
          'Sinharaja Rainforest - endemic species'
        ],
        tips: [
          'Start hikes early morning',
          'Hire local guides for remote trails',
          'Leech socks for rainforest treks',
          'Carry rain gear year-round'
        ]
      }
    ]
  },
  {
    id: 'practical',
    name: 'Practical Information',
    icon: 'ℹ️',
    description: 'Essential travel tips and information',
    printable: true,
    sections: [
      {
        id: 'visa-arrival',
        title: 'Visa & Arrival Information',
        content: `Most visitors need an Electronic Travel Authorization (ETA) before arrival. The ETA can be obtained online and is valid for 30 days with possible extensions.`,
        highlights: [
          'ETA required for most nationalities',
          'Apply online at eta.gov.lk',
          '30-day tourist visa on arrival',
          'Extensions available in Colombo',
          'Passport validity: 6 months minimum'
        ],
        tips: [
          'Apply for ETA 48 hours before travel',
          'Keep printed copy of ETA approval',
          'Have return ticket ready to show',
          'Declare currency over $15,000'
        ]
      },
      {
        id: 'health-safety',
        title: 'Health & Safety',
        content: `Sri Lanka is generally safe for tourists. Take standard precautions with food, water, and sun exposure. Medical facilities in cities are good but limited in rural areas.`,
        highlights: [
          'No mandatory vaccinations',
          'Dengue prevention important',
          'Drink bottled or boiled water',
          'Good medical facilities in Colombo',
          'Travel insurance recommended'
        ],
        tips: [
          'Use mosquito repellent',
          'Avoid tap water and ice',
          'Carry basic first aid kit',
          'Save emergency contact numbers'
        ]
      },
      {
        id: 'money-costs',
        title: 'Money & Costs',
        content: `Sri Lankan Rupee (LKR) is the local currency. ATMs are widely available in cities and towns. Credit cards accepted at hotels and larger restaurants.`,
        highlights: [
          'Currency: Sri Lankan Rupee (LKR)',
          'ATMs widely available',
          'Credit cards in tourist areas',
          'Tipping: 10% in restaurants',
          'Bargaining expected in markets'
        ],
        tips: [
          'Carry small denominations',
          'Exchange money at banks or hotels',
          'Keep ATM receipts for currency proof',
          'Budget $30-100 per day per person'
        ]
      },
      {
        id: 'transport',
        title: 'Getting Around',
        content: `Sri Lanka offers various transport options from trains and buses to private drivers and tuk-tuks. Each mode has its advantages depending on comfort and budget preferences.`,
        highlights: [
          'Trains - scenic and economical',
          'Buses - extensive network, very cheap',
          'Private drivers - comfortable and flexible',
          'Tuk-tuks - short distances in cities',
          'Domestic flights - Colombo to Jaffna/Batticaloa'
        ],
        tips: [
          'Book train tickets in advance for popular routes',
          'Agree tuk-tuk fare before starting',
          'Download PickMe app for taxi service',
          'Consider hiring driver for multi-day trips'
        ]
      }
    ]
  },
  {
    id: 'food',
    name: 'Food & Cuisine',
    icon: '🍛',
    description: 'Sri Lankan culinary experiences',
    printable: true,
    sections: [
      {
        id: 'must-try-dishes',
        title: 'Must-Try Sri Lankan Dishes',
        content: `Sri Lankan cuisine is a flavorful blend of local spices, coconut, and rice. From fiery curries to sweet treats, the island offers diverse culinary experiences.`,
        highlights: [
          'Rice and curry - national dish',
          'Hoppers - bowl-shaped pancakes',
          'Kottu roti - chopped roti stir-fry',
          'Fish ambul thiyal - sour fish curry',
          'Watalappam - coconut custard dessert'
        ],
        tips: [
          'Start with milder curries',
          'Try local breakfast at hotels',
          'Street food generally safe in busy areas',
          'Vegetarian options widely available'
        ]
      },
      {
        id: 'tea-culture',
        title: 'Tea Culture & Experiences',
        content: `As one of the world\'s largest tea exporters, Sri Lanka offers unique tea experiences from plantation visits to professional tastings.`,
        highlights: [
          'Ceylon Tea - world-renowned quality',
          'Tea factory tours in hill country',
          'High tea at colonial hotels',
          'Tea plucking experiences',
          'Tea tasting sessions'
        ],
        tips: [
          'Buy tea directly from factories',
          'Try different elevations\' flavors',
          'Best tea experiences in Nuwara Eliya',
          'Learn proper tea brewing techniques'
        ]
      }
    ]
  }
];

// Helper function to get all content for PDF generation
export const getAllGuideContent = (): GuideCategory[] => {
  return travelGuideCategories.filter(cat => cat.printable);
};

// Helper function to get content by category
export const getGuideByCategory = (categoryId: string): GuideCategory | undefined => {
  return travelGuideCategories.find(cat => cat.id === categoryId);
};

// Helper function to search content
export const searchGuideContent = (query: string): GuideSection[] => {
  const results: GuideSection[] = [];
  const searchTerm = query.toLowerCase();
  
  travelGuideCategories.forEach(category => {
    category.sections.forEach(section => {
      if (
        section.title.toLowerCase().includes(searchTerm) ||
        section.content.toLowerCase().includes(searchTerm) ||
        section.highlights?.some(h => h.toLowerCase().includes(searchTerm)) ||
        section.tips?.some(t => t.toLowerCase().includes(searchTerm))
      ) {
        results.push(section);
      }
    });
  });
  
  return results;
};