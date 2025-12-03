import type { DestinationContent } from '@/services/destinationContentService';

export const kilinochchiDestinationContent: DestinationContent = {
  id: 'kilinochchi',
  name: 'Kilinochchi',
  slug: 'kilinochchi',
  tagline: 'Gateway to the North & Historical Crossroads',
  description:
    'Recharge Travels invites you to explore Kilinochchi—a resilient city rising from history to become a symbol of hope and reconstruction. Journey through the Elephant Pass corridor, marvel at towering war memorials, and discover the tranquil waters of Iranamadu Tank. Our concierge team connects you with local stories, cultural heritage, and the warm hospitality of Sri Lanka\'s northern heartland.',
  heroSlides: [
    {
      image: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=2000&q=80',
      title: 'Reecha Organic Farm',
      subtitle: 'Experience sustainable farming and authentic northern agriculture'
    },
    {
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2000&q=80',
      title: 'Kilinochchi War Memorial',
      subtitle: 'A tribute to courage, resilience, and the spirit of reconciliation'
    },
    {
      image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2000&q=80',
      title: 'Elephant Pass Gateway',
      subtitle: 'The historic causeway connecting Jaffna Peninsula to the mainland'
    },
    {
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=80',
      title: 'Iranamadu Tank Serenity',
      subtitle: 'Ancient irrigation marvel surrounded by lush paddy fields'
    },
    {
      image: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=2000&q=80',
      title: 'Northern Province Heritage',
      subtitle: 'Where Tamil culture, history, and nature converge'
    }
  ],
  attractions: [
    {
      name: 'Reecha Organic Farm',
      description:
        'A pioneering 25-acre organic farm and agro-tourism destination in Kilinochchi, Reecha Farm showcases sustainable northern agriculture with traditional Tamil farming methods. Visitors experience hands-on farming activities, farm-to-table dining, and learn about organic cultivation, palmyrah processing, herbal gardens, and livestock farming in a serene rural setting.',
      image: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=1600&q=80',
      category: 'Agro-Tourism',
      rating: 4.9,
      duration: 'Half day - Full day',
      price: 'From $25',
      icon: 'Leaf',
      featured: true,
      highlights: ['Organic vegetable gardens', 'Traditional palmyrah processing', 'Farm-to-table meals', 'Herbal medicine garden', 'Livestock & poultry', 'Hands-on farming experience', 'Eco-friendly cottages', 'Tamil cooking classes']
    },
    {
      name: 'Kilinochchi War Memorial',
      description:
        'A towering monument dedicated to the fallen soldiers, featuring preserved military equipment, a memorial wall, and landscaped gardens. The site offers a poignant reflection on Sri Lanka\'s history and the journey toward peace.',
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80',
      category: 'Memorial',
      rating: 4.7,
      duration: '1.5 hours',
      price: 'Free',
      icon: 'Landmark',
      highlights: ['Military equipment display', 'Memorial wall', 'Landscaped gardens', 'Educational plaques']
    },
    {
      name: 'Elephant Pass War Memorial',
      description:
        'Located at the strategic causeway connecting Jaffna to the mainland, this memorial marks one of the most significant historical sites of the civil conflict. The preserved battle tank and monument tell stories of sacrifice.',
      image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
      category: 'Heritage',
      rating: 4.6,
      duration: '1 hour',
      price: 'Free',
      icon: 'Shield',
      highlights: ['Preserved battle tank', 'Strategic viewpoint', 'Historical significance', 'Lagoon views']
    },
    {
      name: 'Iranamadu Tank',
      description:
        'One of Sri Lanka\'s largest ancient irrigation tanks, spanning over 2,500 hectares. The tank supports local agriculture and offers serene landscapes perfect for birdwatching, photography, and peaceful sunset moments.',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80',
      category: 'Nature',
      rating: 4.5,
      duration: '2-3 hours',
      price: 'Free',
      icon: 'Waves',
      highlights: ['Ancient irrigation system', 'Birdwatching', 'Fishing communities', 'Spectacular sunsets']
    },
    {
      name: 'Kilinochchi Clock Tower',
      description:
        'The iconic clock tower stands at the heart of Kilinochchi town, serving as a symbol of the city\'s revival. Surrounded by bustling markets and eateries, it\'s the perfect starting point for exploring the town center.',
      image: 'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?auto=format&fit=crop&w=1600&q=80',
      category: 'Landmark',
      rating: 4.3,
      duration: '30 minutes',
      price: 'Free',
      icon: 'Clock',
      highlights: ['City center hub', 'Local markets nearby', 'Photo opportunity', 'Historical landmark']
    },
    {
      name: 'Kandaswamy Kovil Kilinochchi',
      description:
        'A revered Hindu temple serving the local Tamil community with daily pujas, vibrant festivals, and traditional architecture. Experience the spiritual heartbeat of Kilinochchi\'s cultural life.',
      image: 'https://images.unsplash.com/photo-1502989642968-94fbdc9eace4?auto=format&fit=crop&w=1600&q=80',
      category: 'Spiritual',
      rating: 4.6,
      duration: '1 hour',
      price: 'Free (donations welcome)',
      icon: 'Sparkles',
      highlights: ['Daily pujas', 'Festival celebrations', 'Traditional gopuram', 'Local worship experience']
    },
    {
      name: 'Paranthan Junction',
      description:
        'A major crossroads connecting routes to Jaffna, Mullaitivu, and the south. The junction features a monument and serves as a gateway to exploring the entire Northern Province.',
      image: 'https://images.unsplash.com/photo-1470246973918-0296173bc064?auto=format&fit=crop&w=1600&q=80',
      category: 'Heritage',
      rating: 4.2,
      duration: '30 minutes',
      price: 'Free',
      icon: 'Compass',
      highlights: ['Strategic location', 'Historical crossroads', 'Gateway to North', 'Junction monument']
    },
    {
      name: 'Pooneryn Fort Ruins',
      description:
        'Portuguese colonial fort ruins accessible from Kilinochchi, offering a glimpse into the region\'s maritime history. The coastal location provides beautiful views of the Jaffna Lagoon.',
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80',
      category: 'Heritage',
      rating: 4.4,
      duration: '2 hours',
      price: 'Free',
      icon: 'Castle',
      highlights: ['Portuguese ruins', 'Lagoon views', 'Historical exploration', 'Off-the-beaten-path']
    },
    {
      name: 'Vaddakachchi Church',
      description:
        'A beautiful Catholic church serving the local Christian community, featuring colonial-era architecture and peaceful grounds. A testament to the religious diversity of the Northern Province.',
      image: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1600&q=80',
      category: 'Spiritual',
      rating: 4.3,
      duration: '45 minutes',
      price: 'Free',
      icon: 'Building',
      highlights: ['Colonial architecture', 'Peaceful grounds', 'Religious heritage', 'Community worship']
    }
  ],
  activities: [
    {
      name: 'Reecha Farm Full Experience',
      description:
        'Complete immersive day at Reecha Organic Farm including guided farm tour, hands-on organic gardening, traditional palmyrah tapping demonstration, farm-to-table lunch with fresh produce, and take-home organic products.',
      icon: 'Leaf',
      price: 'From $65 per guest',
      duration: 'Full Day (7 hours)',
      popular: true
    },
    {
      name: 'Reecha Farm Cooking Class',
      description:
        'Learn authentic northern Tamil cuisine using fresh organic ingredients from Reecha Farm. Prepare traditional dishes like kool, pittu, and vegetable curries under the guidance of local chefs, then enjoy your creations.',
      icon: 'UtensilsCrossed',
      price: 'From $45',
      duration: '4 hours',
      popular: true
    },
    {
      name: 'Reecha Farm Sunrise Tour',
      description:
        'Early morning farm experience starting with sunrise yoga, followed by milking cows, collecting fresh eggs, harvesting vegetables, and enjoying a wholesome organic breakfast in the farm pavilion.',
      icon: 'Sun',
      price: 'From $35',
      duration: '3 hours'
    },
    {
      name: 'Palmyrah Heritage Workshop',
      description:
        'Discover the cultural significance of the palmyrah palm at Reecha Farm. Learn traditional tapping, taste fresh toddy, make jaggery, weave palm leaves, and understand how this tree sustains northern communities.',
      icon: 'TreePalm',
      price: 'From $40',
      duration: '3 hours'
    },
    {
      name: 'Reecha Farm Stay Experience',
      description:
        'Overnight stay in Reecha Farm\'s eco-friendly cottages with full board organic meals, evening bonfire, stargazing, morning farm activities, and complete disconnect from digital life in nature\'s embrace.',
      icon: 'Bed',
      price: 'From $95 per night',
      duration: 'Overnight'
    },
    {
      name: 'Northern Heritage Circuit Tour',
      description:
        'Comprehensive day tour covering Kilinochchi War Memorial, Elephant Pass, and key historical sites with bilingual guide narration and local lunch experience.',
      icon: 'Car',
      price: 'From $85 per guest',
      duration: 'Full Day (8 hours)',
      popular: true
    },
    {
      name: 'Iranamadu Tank Sunrise Experience',
      description:
        'Early morning excursion to witness the spectacular sunrise over Iranamadu Tank, followed by village walks and traditional breakfast with a farming family.',
      icon: 'Sun',
      price: 'From $45',
      duration: '4 hours'
    },
    {
      name: 'Agricultural Village Immersion',
      description:
        'Spend a day with local farmers learning traditional paddy cultivation, palmyrah tapping, and agricultural practices that sustain the northern communities.',
      icon: 'Leaf',
      price: 'From $55',
      duration: '5 hours'
    },
    {
      name: 'Tamil Cooking Class',
      description:
        'Hands-on cooking experience learning to prepare authentic northern Tamil dishes including kool, pittu, and regional curries in a traditional home setting.',
      icon: 'UtensilsCrossed',
      price: 'From $40',
      duration: '3 hours'
    },
    {
      name: 'Cycling Through History',
      description:
        'Guided 25km bicycle tour through Kilinochchi\'s restored roads, passing war memorials, village temples, and scenic paddy fields with support vehicle.',
      icon: 'Bike',
      price: 'From $35',
      duration: '4 hours'
    },
    {
      name: 'Jaffna-Kilinochchi Day Journey',
      description:
        'Combined tour connecting Kilinochchi attractions with Jaffna Peninsula highlights, offering the complete Northern Province experience in one day.',
      icon: 'MapPin',
      price: 'From $120',
      duration: 'Full Day (10 hours)'
    }
  ],
  restaurants: [
    {
      name: 'Reecha Farm Kitchen',
      description:
        'Farm-to-table dining experience at Reecha Organic Farm serving fresh organic meals prepared with ingredients harvested the same day. Traditional northern Tamil cuisine in an open-air pavilion surrounded by lush gardens. Reservations required for non-guests.',
      image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80',
      cuisine: 'Organic Farm-to-Table',
      priceRange: '$$',
      rating: 4.9,
      address: 'Reecha Organic Farm, Kilinochchi',
      featured: true,
      specialties: ['Organic rice & curry', 'Fresh vegetable thali', 'Palmyrah desserts', 'Herbal teas', 'Wood-fired bread', 'Farm-fresh eggs'],
      openHours: 'By reservation (8:00 AM – 8:00 PM)'
    },
    {
      name: 'Hotel Nellai',
      description:
        'Popular local restaurant known for authentic Tamil cuisine, generous portions, and affordable prices. A favorite among travelers passing through Kilinochchi.',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80',
      cuisine: 'Tamil & Sri Lankan',
      priceRange: '$',
      rating: 4.4,
      address: 'A9 Highway, Kilinochchi Town',
      specialties: ['Rice & curry', 'Kottu roti', 'Dosai', 'String hoppers'],
      openHours: '06:00 AM – 10:00 PM'
    },
    {
      name: 'City Rest House',
      description:
        'Government rest house offering clean, reliable dining with traditional Sri Lankan meals. A trusted stop for travelers on the northern route.',
      image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=1200&q=80',
      cuisine: 'Sri Lankan',
      priceRange: '$$',
      rating: 4.2,
      address: 'Near Clock Tower, Kilinochchi',
      specialties: ['Set lunch', 'Seafood curry', 'Vegetable kottu', 'Fresh juices'],
      openHours: '07:00 AM – 09:00 PM'
    },
    {
      name: 'Malini Café',
      description:
        'Cozy local café serving fresh short eats, tea, and quick meals. Perfect for a refreshment break while exploring Kilinochchi town.',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
      cuisine: 'Café & Short Eats',
      priceRange: '$',
      rating: 4.3,
      address: 'Main Street, Kilinochchi',
      specialties: ['Vadai', 'Samosa', 'Ceylon tea', 'Fresh pastries'],
      openHours: '06:30 AM – 08:00 PM'
    },
    {
      name: 'Northern Spice Restaurant',
      description:
        'Family-run establishment specializing in northern Tamil cuisine with recipes passed down through generations. Known for authentic Jaffna-style crab curry.',
      image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1200&q=80',
      cuisine: 'Northern Tamil',
      priceRange: '$$',
      rating: 4.5,
      address: 'Paranthan Road, Kilinochchi',
      specialties: ['Jaffna crab curry', 'Kool soup', 'Mutton curry', 'Palmyrah desserts'],
      openHours: '11:00 AM – 10:00 PM'
    }
  ],
  hotels: [
    {
      name: 'Reecha Farm Eco-Cottages',
      description:
        'Unique eco-friendly cottages nestled within Reecha Organic Farm offering an authentic farm stay experience. Wake up to roosters, enjoy organic farm-to-table meals, participate in farming activities, and experience true rural northern hospitality. Perfect for nature lovers and eco-tourists.',
      image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1600&q=80',
      starRating: 4,
      priceRange: 'From $95 per night (full board)',
      amenities: ['Eco-cottages', 'Organic meals included', 'Farm activities', 'Nature trails', 'Bonfire area', 'No Wi-Fi (digital detox)', 'Yoga space'],
      address: 'Reecha Organic Farm, Kilinochchi',
      category: 'Eco Farm Stay',
      featured: true
    },
    {
      name: 'Kilinochchi City Hotel',
      description:
        'Modern hotel in the heart of Kilinochchi offering comfortable rooms, air conditioning, and convenient access to all attractions. Ideal base for northern exploration.',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80',
      starRating: 3,
      priceRange: 'From $45 per night',
      amenities: ['A/C rooms', 'Restaurant', 'Free Wi-Fi', 'Parking', '24/7 reception'],
      address: 'A9 Highway, Kilinochchi Town',
      category: 'City Hotel'
    },
    {
      name: 'Thalsevana Holiday Resort',
      description:
        'Comfortable resort-style accommodation with spacious rooms, gardens, and family-friendly amenities. Popular choice for travelers exploring the Northern Province.',
      image: 'https://images.unsplash.com/photo-1501117716987-c8e1ecb210cc?auto=format&fit=crop&w=1600&q=80',
      starRating: 3,
      priceRange: 'From $55 per night',
      amenities: ['Swimming pool', 'Garden', 'Restaurant', 'Conference room', 'Parking'],
      address: 'Iranamadu Road, Kilinochchi',
      category: 'Resort'
    },
    {
      name: 'Government Rest House',
      description:
        'Historic rest house offering basic but clean accommodation with authentic Sri Lankan hospitality. A budget-friendly option with reliable service.',
      image: 'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=1600&q=80',
      starRating: 2,
      priceRange: 'From $25 per night',
      amenities: ['Basic rooms', 'Restaurant', 'Parking', 'Garden', 'Historic building'],
      address: 'Near Clock Tower, Kilinochchi',
      category: 'Budget Stay'
    },
    {
      name: 'Northern Comfort Inn',
      description:
        'Newly built guesthouse offering modern amenities and warm hospitality. Features clean rooms, home-cooked meals, and helpful staff for tour arrangements.',
      image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80',
      starRating: 3,
      priceRange: 'From $40 per night',
      amenities: ['A/C rooms', 'Home cooking', 'Tour assistance', 'Wi-Fi', 'Airport pickup'],
      address: 'Paranthan Junction, Kilinochchi',
      category: 'Guesthouse'
    }
  ],
  destinationInfo: {
    population: '35,000 (District: 112,000)',
    area: '1,279 km² district',
    elevation: '10 m above sea level',
    bestTime: 'February – September (dry season)',
    language: 'Tamil & English spoken',
    currency: 'LKR (USD accepted at hotels)'
  },
  weatherInfo: {
    temperature: '26°C – 34°C year-round',
    humidity: '70-85%',
    rainfall: 'Low Feb-Sep, NE monsoon Oct-Jan',
    season: 'Tropical dry zone',
    bestMonths: ['February', 'March', 'April', 'May', 'June', 'July', 'August', 'September'],
    packingTips: [
      'Lightweight cotton clothing for hot weather',
      'Sunscreen SPF 50+ and sunglasses essential',
      'Modest dress for temple and memorial visits',
      'Comfortable walking shoes',
      'Reusable water bottle and electrolytes',
      'Light jacket for air-conditioned vehicles'
    ]
  },
  travelTips: [
    {
      title: 'Getting to Kilinochchi',
      icon: 'Car',
      category: 'Transport',
      tips: [
        'Kilinochchi is 320km from Colombo via A9 Highway (6-7 hours drive)',
        'Regular bus services from Colombo, Jaffna, and Vavuniya',
        'Nearest railway station is Kilinochchi on the Northern Line',
        'Private car hire recommended for flexible exploration',
        'Recharge Travels offers airport transfers and guided transport'
      ],
      content: 'The restored A9 Highway provides scenic, comfortable access to Kilinochchi from all major cities.'
    },
    {
      title: 'Respectful Tourism',
      icon: 'Heart',
      category: 'Culture',
      tips: [
        'War memorial sites are places of remembrance—maintain respectful silence',
        'Ask permission before photographing local people or ceremonies',
        'Dress modestly when visiting temples and religious sites',
        'Support local businesses and community initiatives',
        'Learn a few Tamil phrases—locals appreciate the effort'
      ],
      content: 'Kilinochchi\'s history demands sensitivity. Approach memorial visits with respect and openness.'
    },
    {
      title: 'Safety & Practical Tips',
      icon: 'Shield',
      category: 'Safety',
      tips: [
        'Kilinochchi is safe for tourists—enjoy exploring freely',
        'Carry identification documents for any checkpoints',
        'ATMs available in town center—carry cash for rural areas',
        'Mobile coverage is good—Dialog and Mobitel networks work well',
        'Stay hydrated—temperatures can be intense during midday'
      ],
      content: 'The region has transformed into a welcoming destination with improving infrastructure.'
    },
    {
      title: 'Best Time to Visit',
      icon: 'Calendar',
      category: 'Seasonal',
      tips: [
        'Dry season (Feb-Sep) offers the best weather for exploration',
        'Thai Pongal (January) features colorful harvest celebrations',
        'Avoid northeast monsoon (Oct-Jan) for outdoor activities',
        'Morning visits recommended for memorial sites',
        'Sunset at Iranamadu Tank is a highlight not to miss'
      ],
      content: 'Plan visits during dry season for comfortable weather and full access to all attractions.'
    }
  ],
  signatureTours: [
    {
      name: 'Reecha Organic Farm Retreat',
      description:
        'Exclusive 2-day wellness and agro-tourism retreat at Reecha Organic Farm. Disconnect from the world and reconnect with nature through organic farming, traditional cooking, yoga sessions, and authentic northern hospitality in eco-friendly farm cottages.',
      image: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=1600&q=80',
      duration: '2 Days / 1 Night',
      priceFrom: 'From $195 per guest',
      highlights: ['Eco-cottage accommodation', 'Farm-to-table all meals', 'Organic farming workshop', 'Tamil cooking class', 'Palmyrah tapping', 'Sunrise yoga'],
      includes: ['Farm stay accommodation', 'All organic meals', 'Farm activities', 'Cooking class', 'Transport from Kilinochchi', 'Take-home organic products'],
      badge: 'Farm Retreat',
      isBestSeller: true
    },
    {
      name: 'Northern Province Heritage Trail',
      description:
        'Comprehensive 3-day journey covering Kilinochchi, Elephant Pass, and extending to Jaffna highlights. Experience war memorials, ancient temples, and authentic Tamil culture.',
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80',
      duration: '3 Days / 2 Nights',
      priceFrom: 'From $385 per guest',
      highlights: ['War Memorial visits', 'Elephant Pass experience', 'Jaffna temple tour', 'Local cuisine immersion'],
      includes: ['Private vehicle & driver', 'Bilingual guide', 'All meals', 'Hotel accommodation', 'Entry fees'],
      badge: 'Signature Journey',
      isBestSeller: true
    },
    {
      name: 'Kilinochchi Day Discovery',
      description:
        'Full-day exploration of Kilinochchi\'s key attractions including the War Memorial, Clock Tower, Iranamadu Tank, and local temple visit with authentic lunch.',
      image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
      duration: '1 Day (10 hours)',
      priceFrom: 'From $95 per guest',
      highlights: ['War Memorial tour', 'Iranamadu Tank sunset', 'Temple visit', 'Local lunch'],
      includes: ['Private vehicle', 'Guide', 'Lunch', 'Refreshments', 'All entry fees'],
      badge: 'Day Trip'
    },
    {
      name: 'Vanni Region Agricultural Experience',
      description:
        'Immersive 2-day journey into rural Kilinochchi life. Stay with local families, participate in farming activities, and discover the resilience of northern communities.',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80',
      duration: '2 Days / 1 Night',
      priceFrom: 'From $220 per guest',
      highlights: ['Village homestay', 'Paddy farming experience', 'Traditional cooking', 'Cultural exchange'],
      includes: ['Homestay accommodation', 'All meals', 'Activities', 'Transport', 'Guide'],
      badge: 'Cultural Immersion'
    },
    {
      name: 'Complete Northern Circuit',
      description:
        '5-day comprehensive exploration covering Kilinochchi, Mullaitivu, Jaffna, and Delft Island. The ultimate Northern Province experience with luxury accommodation.',
      image: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=1600&q=80',
      duration: '5 Days / 4 Nights',
      priceFrom: 'From $750 per guest',
      highlights: ['All major memorials', 'Delft Island expedition', 'Jaffna cultural tour', 'Mullaitivu beaches'],
      includes: ['Premium hotels', 'Private vehicle', 'Expert guide', 'All meals', 'Ferry tickets', 'Permits'],
      badge: 'Ultimate Experience'
    }
  ],
  seo: {
    title: 'Kilinochchi Sri Lanka Tours | Reecha Organic Farm, War Memorial & Northern Heritage',
    description:
      'Explore Kilinochchi with Recharge Travels—experience Reecha Organic Farm agro-tourism, visit the War Memorial, Elephant Pass, Iranamadu Tank, and authentic Northern Province Tamil heritage.',
    keywords: [
      'Kilinochchi tours',
      'Reecha Organic Farm',
      'Reecha Farm Kilinochchi',
      'agro tourism Sri Lanka',
      'organic farm stay Sri Lanka',
      'Kilinochchi War Memorial',
      'Elephant Pass Sri Lanka',
      'Northern Province tours',
      'Iranamadu Tank',
      'Tamil heritage',
      'farm to table Sri Lanka',
      'Recharge Travels Kilinochchi',
      'Sri Lanka North'
    ]
  },
  ctaSection: {
    title: 'Discover Kilinochchi with Recharge Travels',
    subtitle: 'Our Northern Province specialists arrange meaningful tours through Kilinochchi\'s memorials, cultural sites, and hidden gems with respect and expertise.',
    buttonText: 'Plan My Kilinochchi Journey'
  },
  isPublished: true,
  updatedAt: null,
  createdAt: null
};
