export interface PopularRoute {
  slug: string;
  origin: string;
  destination: string;
  title: string;
  metaDescription: string;
  distance: string;
  duration: string;
  startingPrice: number;
  highlights: string[];
  content: {
    intro: string;
    whyChooseUs: string[];
    routeHighlights: string[];
    whatToExpect: string[];
    bookingTips: string[];
  };
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export const popularRoutes: PopularRoute[] = [
  {
    slug: 'colombo-airport-to-kandy',
    origin: 'Colombo Airport (CMB)',
    destination: 'Kandy',
    title: 'Colombo Airport to Kandy Transfer | Direct Routes from $45',
    metaDescription: 'Book reliable Colombo Airport (CMB) to Kandy transfers. 3-hour journey through scenic routes. Professional drivers, 24/7 service, instant confirmation.',
    distance: '115 km',
    duration: '3 hours',
    startingPrice: 45,
    highlights: ['Direct route', 'No hidden fees', 'Free cancellation', '24/7 availability'],
    content: {
      intro: 'Experience a comfortable journey from Bandaranaike International Airport (CMB) to the cultural capital of Kandy. Our professional drivers ensure a safe and scenic 3-hour transfer through Sri Lanka\'s beautiful countryside.',
      whyChooseUs: [
        'Fixed prices with no hidden charges',
        'Meet & greet service at airport arrivals',
        'Flight monitoring for delays',
        'English-speaking professional drivers',
        'Modern air-conditioned vehicles',
        'Complimentary bottled water'
      ],
      routeHighlights: [
        'Pass through Colombo\'s suburbs',
        'View of traditional Sri Lankan villages',
        'Scenic mountain approaches to Kandy',
        'Optional stop at Pinnawala Elephant Orphanage',
        'Photo opportunities at viewpoints'
      ],
      whatToExpect: [
        'Driver waiting at arrivals with name board',
        'Assistance with luggage',
        'Comfortable 3-hour journey',
        'Optional stops for refreshments',
        'Drop-off at any Kandy hotel or location'
      ],
      bookingTips: [
        'Book 24 hours in advance for best rates',
        'Night transfers (10 PM - 6 AM) have 20% surcharge',
        'Larger groups save with minivans',
        'Include flight details for monitoring'
      ]
    },
    faqs: [
      {
        question: 'How much does a taxi from Colombo Airport to Kandy cost?',
        answer: 'Our transfers start from $45 for a sedan (1-3 passengers). SUVs cost around $58, and minivans for larger groups start at $68. All prices include meet & greet, tolls, and taxes.'
      },
      {
        question: 'How long is the journey from CMB to Kandy?',
        answer: 'The journey typically takes 3 hours via the Colombo-Kandy highway (A1). Traffic conditions, especially leaving Colombo, can add 30-45 minutes during peak hours.'
      },
      {
        question: 'Is it safe to travel at night?',
        answer: 'Yes, our drivers are experienced with night transfers. The highway is well-lit and maintained. We track all journeys for added safety.'
      },
      {
        question: 'Can we stop at Pinnawala Elephant Orphanage?',
        answer: 'Yes! It\'s a popular stop en route to Kandy. The visit adds about 2 hours to your journey. Additional charges apply for waiting time.'
      }
    ]
  },
  {
    slug: 'colombo-airport-to-galle',
    origin: 'Colombo Airport (CMB)',
    destination: 'Galle',
    title: 'Colombo Airport to Galle Transfer | Coastal Route from $55',
    metaDescription: 'Direct transfers from Colombo Airport to Galle Fort & beaches. 2.5-hour scenic coastal journey. Professional drivers, fixed prices, instant booking.',
    distance: '148 km',
    duration: '2.5 hours',
    startingPrice: 55,
    highlights: ['Scenic coastal route', 'Fixed pricing', 'Free cancellation', 'Professional drivers'],
    content: {
      intro: 'Travel from Colombo Airport to the historic Galle Fort and beautiful southern beaches. Choose between the fast expressway or the scenic coastal route for your 2.5-hour journey.',
      whyChooseUs: [
        'Choice of expressway or coastal route',
        'Fixed prices - no surge charging',
        'Real-time flight tracking',
        'Experienced English-speaking drivers',
        'Clean, modern vehicles with AC',
        'Free WiFi in premium vehicles'
      ],
      routeHighlights: [
        'Southern Expressway - fastest route (2 hours)',
        'Coastal route via Bentota and Hikkaduwa (3 hours)',
        'Ocean views and palm-fringed beaches',
        'Colonial architecture in Galle Fort',
        'Optional stops at turtle hatcheries'
      ],
      whatToExpect: [
        'Warm welcome at airport arrivals',
        'Help with luggage handling',
        'Choice of route based on preference',
        'Comfortable air-conditioned journey',
        'Drop-off at Galle hotels or Fort area'
      ],
      bookingTips: [
        'Expressway tolls included in price',
        'Coastal route recommended for daytime',
        'Book return transfers for 10% discount',
        'Large luggage? Book an SUV'
      ]
    },
    faqs: [
      {
        question: 'Should I take the expressway or coastal route?',
        answer: 'The expressway is faster (2 hours) and better for night transfers or if you\'re tired. The coastal route takes 3+ hours but offers beautiful ocean views and photo stops.'
      },
      {
        question: 'What\'s the cost for CMB to Galle transfer?',
        answer: 'Sedan transfers start at $55, SUVs from $71, and minivans from $85. All prices include expressway tolls, meet & greet, and taxes.'
      },
      {
        question: 'Can we stop for photos along the way?',
        answer: 'Yes! Popular stops include Bentota Beach, Hikkaduwa Beach, and Koggala Stilt Fishermen. Quick photo stops are free; longer stops may incur waiting charges.'
      },
      {
        question: 'Is the expressway safe?',
        answer: 'Very safe. The E01 Southern Expressway is Sri Lanka\'s first modern highway with proper lighting, rest areas, and emergency services.'
      }
    ]
  },
  {
    slug: 'kandy-to-ella',
    origin: 'Kandy',
    destination: 'Ella',
    title: 'Kandy to Ella Transfer | Scenic Hill Country Route from $65',
    metaDescription: 'Book Kandy to Ella private transfers through tea country. 5-hour scenic drive via Nuwara Eliya. Reliable drivers, stunning views, flexible stops.',
    distance: '140 km',
    duration: '5 hours',
    startingPrice: 65,
    highlights: ['Tea plantation views', 'Flexible photo stops', 'Experienced drivers', 'Scenic route'],
    content: {
      intro: 'Journey through Sri Lanka\'s breathtaking hill country from Kandy to Ella. This scenic 5-hour drive passes tea plantations, waterfalls, and misty mountains.',
      whyChooseUs: [
        'Drivers familiar with mountain roads',
        'Flexible stops at attractions',
        'Comfortable vehicles for winding roads',
        'Local knowledge and recommendations',
        'Safety-first approach on hill roads',
        'Options for one-way or return trips'
      ],
      routeHighlights: [
        'Ramboda Falls viewpoint',
        'Tea factories and plantations',
        'Nuwara Eliya (Little England)',
        'Hakgala Botanical Gardens area',
        'Mountain viewpoints and valleys'
      ],
      whatToExpect: [
        'Pick-up from Kandy hotel',
        'Scenic 5-hour mountain drive',
        'Multiple photo opportunities',
        'Optional tea factory visit',
        'Drop-off at Ella accommodation'
      ],
      bookingTips: [
        'Start early to enjoy daylight views',
        'Bring warm clothes for Nuwara Eliya',
        'Book SUV for more comfort on hills',
        'Allow extra time for photo stops'
      ]
    },
    faqs: [
      {
        question: 'Can we stop at tea factories?',
        answer: 'Absolutely! Mackwoods, Pedro, and Blue Field tea estates are popular stops. Factory tours take 30-45 minutes. Your driver can recommend the best ones.'
      },
      {
        question: 'Is the road difficult?',
        answer: 'The road has many curves and climbs but is well-maintained. Our experienced drivers handle hill country roads daily. Motion sickness tablets recommended for sensitive travelers.'
      },
      {
        question: 'What\'s the best time to travel?',
        answer: 'Morning departures (7-9 AM) offer the best views and arrive before afternoon mist. Avoid late afternoon during rainy season (Oct-Dec, Apr-May).'
      },
      {
        question: 'Can we book this as part of a tour?',
        answer: 'Yes! We offer multi-day packages covering Kandy-Nuwara Eliya-Ella with overnight stops. Contact us for customized itineraries.'
      }
    ]
  },
  {
    slug: 'colombo-to-sigiriya',
    origin: 'Colombo',
    destination: 'Sigiriya',
    title: 'Colombo to Sigiriya Transfer | Direct Route from $75',
    metaDescription: 'Private transfer from Colombo to Sigiriya Rock Fortress. 4-hour direct journey through cultural triangle. Professional drivers, comfortable vehicles.',
    distance: '169 km',
    duration: '4 hours',
    startingPrice: 75,
    highlights: ['Direct route', 'Cultural triangle access', 'Flexible timing', 'Professional service'],
    content: {
      intro: 'Travel from Colombo to the iconic Sigiriya Rock Fortress in comfort. Our 4-hour transfer service gets you to this UNESCO World Heritage site refreshed and ready to explore.',
      whyChooseUs: [
        'Direct route via A1 and A6 highways',
        'Knowledgeable drivers about local sites',
        'Early morning departures available',
        'Complimentary water and refreshments',
        'Optional stops at Dambulla Cave Temple',
        'Return trip options same day'
      ],
      routeHighlights: [
        'Colombo to Kurunegala highway',
        'Traditional village landscapes',
        'Dambulla Cave Temple (optional)',
        'Sigiriya Rock Fortress approach',
        'Cultural Triangle region'
      ],
      whatToExpect: [
        'Hotel pick-up in Colombo',
        '4-hour comfortable journey',
        'Highway and countryside views',
        'Arrival at Sigiriya area',
        'Drop at hotel or ticket counter'
      ],
      bookingTips: [
        'Book early morning for same-day return',
        'Combine with Dambulla for full day',
        'Larger vehicles for families',
        'Consider overnight packages'
      ]
    },
    faqs: [
      {
        question: 'Can we visit Sigiriya and return to Colombo same day?',
        answer: 'Yes, with a 6 AM start. You\'ll reach Sigiriya by 10 AM, have 4-5 hours to explore, and return to Colombo by 8 PM. It\'s a long day but doable.'
      },
      {
        question: 'How much for Colombo to Sigiriya transfer?',
        answer: 'One-way transfers start at $75 for sedan, $97 for SUV, and $115 for minivan. Return same-day trips from $135. All inclusive of tolls and taxes.'
      },
      {
        question: 'Can we stop at Dambulla Caves?',
        answer: 'Yes! Dambulla is just 20 minutes before Sigiriya. Adding a 1-hour stop costs around $10 extra for waiting time. Highly recommended combination.'
      },
      {
        question: 'What time should we leave Colombo?',
        answer: 'For day trips, leave by 6-7 AM. For overnight stays, anytime works but morning departures avoid Colombo traffic and afternoon heat at Sigiriya.'
      }
    ]
  },
  {
    slug: 'galle-to-mirissa',
    origin: 'Galle',
    destination: 'Mirissa',
    title: 'Galle to Mirissa Beach Transfer | Coastal Route from $25',
    metaDescription: 'Quick transfer from Galle Fort to Mirissa Beach. 45-minute scenic coastal drive. Reliable service for whale watching tours and beach stays.',
    distance: '35 km',
    duration: '45 minutes',
    startingPrice: 25,
    highlights: ['Short coastal drive', 'Beach hopping option', 'Whale watching connections', 'Budget friendly'],
    content: {
      intro: 'Connect between Galle\'s historic fort and Mirissa\'s palm-fringed beaches with our reliable transfer service. Perfect for beach hoppers and whale watching enthusiasts.',
      whyChooseUs: [
        'Quick 45-minute coastal journey',
        'Flexible stops at beaches',
        'Early morning whale watching transfers',
        'Local drivers with area knowledge',
        'Small luggage or surfboard friendly',
        'Competitive rates for short distance'
      ],
      routeHighlights: [
        'Galle Fort departure',
        'Unawatuna Beach bypass',
        'Koggala Beach and stilt fishermen',
        'Weligama Bay views',
        'Mirissa Beach arrival'
      ],
      whatToExpect: [
        'Pick-up from Galle Fort or hotels',
        'Scenic coastal road journey',
        'Optional beach photo stops',
        'Surfboard transportation available',
        'Drop at Mirissa hotels or beach'
      ],
      bookingTips: [
        'Book night before for whale watching',
        '5 AM transfers for whale tours',
        'Combine with airport transfers',
        'Group rates for beach hoppers'
      ]
    },
    faqs: [
      {
        question: 'How early for whale watching transfers?',
        answer: 'Whale watching boats leave Mirissa harbor at 6:30 AM. We recommend 5:00 AM pick-up from Galle to arrive comfortably. We track your tour operator\'s schedule.'
      },
      {
        question: 'Can we stop at other beaches?',
        answer: 'Yes! Unawatuna (10 min), Koggala (20 min), and Weligama (35 min) are along the route. Quick photo stops are free; beach visits add waiting time charges.'
      },
      {
        question: 'Do you transport surfboards?',
        answer: 'Yes, our SUVs and minivans accommodate surfboards. Please mention when booking. Sedans can take 1-2 shortboards with roof racks (small extra charge).'
      },
      {
        question: 'Is the road good?',
        answer: 'Excellent! The A2 coastal road is well-maintained with beautiful ocean views. Traffic is light except Galle Fort area during weekends.'
      }
    ]
  },
  {
    slug: 'colombo-airport-to-negombo',
    origin: 'Colombo Airport (CMB)',
    destination: 'Negombo',
    title: 'Colombo Airport to Negombo Transfer | Quick 20-Min Route from $15',
    metaDescription: 'Fast Colombo Airport to Negombo beach transfers. Only 20 minutes drive. Perfect for flight layovers. 24/7 service with meet and greet.',
    distance: '12 km',
    duration: '20 minutes',
    startingPrice: 15,
    highlights: ['Super quick transfer', 'Budget friendly', 'Perfect for layovers', '24/7 availability'],
    content: {
      intro: 'The quickest transfer from Colombo Airport to Negombo beach hotels. Just 20 minutes to reach your beachfront accommodation or catch early morning flights.',
      whyChooseUs: [
        'Shortest airport transfer route',
        'Fixed rate - no meters',
        'Perfect for late arrivals',
        'Early morning flight connections',
        'Beach hotel specialists',
        'Quick turnaround service'
      ],
      routeHighlights: [
        'Airport to Negombo road',
        'Negombo lagoon views',
        'Beach road hotels',
        'Town center option',
        'Fish market area (morning)'
      ],
      whatToExpect: [
        'Quick airport exit',
        '20-minute direct drive',
        'No traffic delays usually',
        'Beach hotel drop-offs',
        'Return booking options'
      ],
      bookingTips: [
        'Pre-book for late flights',
        'Share rides for budget option',
        'Return transfers for flights',
        'Specify beach or town hotels'
      ]
    },
    faqs: [
      {
        question: 'Why choose Negombo for first/last night?',
        answer: 'Just 20 minutes from airport - perfect for late arrivals or early departures. Beach hotels, restaurants, and relaxed atmosphere without long transfers.'
      },
      {
        question: 'How much is a taxi to Negombo?',
        answer: 'Our fixed rates: Sedan $15, SUV $19, Minivan $25. Airport taxis may charge more. Tuk-tuks available for $8-10 but not recommended with luggage.'
      },
      {
        question: 'Can we book return transfer to airport?',
        answer: 'Yes! Book round-trip for 10% discount. We pick up 3 hours before international flights. Early morning pick-ups (4-6 AM) available 24/7.'
      },
      {
        question: 'Is Negombo worth visiting?',
        answer: 'Great for airport proximity. Nice beaches, lagoon trips, fish market, and churches. Perfect for recovering from flights or last-minute shopping.'
      }
    ]
  }
];

// Helper function to get route by slug
export const getRouteBySlug = (slug: string): PopularRoute | undefined => {
  return popularRoutes.find(route => route.slug === slug);
};

// Helper function to generate route slugs for static generation
export const getAllRouteSlugs = (): string[] => {
  return popularRoutes.map(route => route.slug);
};

// SEO-friendly route title generator
export const generateRouteTitle = (origin: string, destination: string, price: number): string => {
  return `${origin} to ${destination} Transfer | From $${price} | Recharge Travels`;
};

// Meta description generator
export const generateMetaDescription = (origin: string, destination: string, duration: string): string => {
  return `Book reliable ${origin} to ${destination} transfers. ${duration} journey with professional drivers. Fixed prices, instant confirmation, 24/7 service.`;
};