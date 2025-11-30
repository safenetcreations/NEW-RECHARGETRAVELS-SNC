import type { DestinationContent } from '@/services/destinationContentService';

export const jaffnaDestinationContent: DestinationContent = {
  id: 'jaffna',
  name: 'Jaffna',
  slug: 'jaffna',
  tagline: 'Tamil Heritage Capital & Northern Islands',
  description:
    'Recharge Travels curates immersive journeys across Sri Lanka\'s northern peninsula—from crimson temple festivals and lagoon harvests to Delft Island\'s wild ponies. Base yourself in Jaffna City and weave through palmyrah groves, Dutch-era bastions, and coral-ringed beaches with our bilingual concierge team.',
  heroSlides: [
    {
      image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2000&q=80',
      title: 'Jaffna Fort Lagoon Glow',
      subtitle: 'Golden ramparts, coral walls, and a sapphire moat at sunset'
    },
    {
      image: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=2000&q=80',
      title: 'Nallur Festival Processions',
      subtitle: 'Crimson-clad devotees, drummers, and a 600-year-old kovil'
    },
    {
      image: 'https://images.unsplash.com/photo-1526481280695-3c469d1d53b1?auto=format&fit=crop&w=2000&q=80',
      title: 'Casuarina Beach Pastels',
      subtitle: 'Shallow turquoise water wrapped by whispering casuarina trees'
    },
    {
      image: 'https://images.unsplash.com/photo-1470246973918-0296173bc064?auto=format&fit=crop&w=2000&q=80',
      title: 'Delft Island Wild Ponies',
      subtitle: 'Sail the Palk Strait to baobab groves and Portuguese ruins'
    },
    {
      image: 'https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?auto=format&fit=crop&w=2000&q=80',
      title: 'Lagoon Nights & Palmyrah Skies',
      subtitle: 'Fisher lanterns, toddy taps, and velvet northern skies'
    }
  ],
  attractions: [
    {
      name: 'Nallur Kandaswamy Kovil',
      description:
        'Sri Lanka\'s most venerated Hindu temple, rebuilt in 1734 and famed for its gold-flecked gopuram, nightly pujas, and the 25-day August festival processions.',
      image: 'https://images.unsplash.com/photo-1502989642968-94fbdc9eace4?auto=format&fit=crop&w=1600&q=80',
      category: 'Spiritual',
      rating: 4.9,
      duration: '2 hours',
      price: 'Free (donations welcome)',
      icon: 'Temple',
      highlights: ['Golden gopuram', 'Nightly pujas', 'Festival chariots', 'Dress code enforcement']
    },
    {
      name: 'Jaffna Fort & Queen\'s Bastion',
      description:
        'A star-shaped Dutch fort from 1618 guarding the lagoon. Wander coral ramparts, restored tunnels, and the Queen\'s Bastion lookout with sweeping sunrise views.',
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80',
      category: 'Heritage',
      rating: 4.6,
      duration: '90 minutes',
      price: 'LKR 500',
      icon: 'Castle',
      highlights: ['Lagoon panorama', 'Restored ramparts', 'Dutch church ruins', 'Great photography light']
    },
    {
      name: 'Casuarina Beach, Karainagar',
      description:
        'A protected horseshoe beach on Karainagar Island where powdery sand and shallow turquoise waters invite hours of safe swimming and sunset strolls.',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
      category: 'Coastline',
      rating: 4.7,
      duration: 'Half day',
      price: 'Free',
      icon: 'Waves',
      highlights: ['Shade from casuarina trees', 'Safe lagoon swimming', 'Off-grid cabanas', 'Sunset picnics']
    },
    {
      name: 'Jaffna Public Library',
      description:
        'The iconic Indo-Saracenic library rebuilt after 1981, now home to 100,000+ manuscripts, palm-leaf records, and breezy reading verandas.',
      image: 'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?auto=format&fit=crop&w=1600&q=80',
      category: 'Culture',
      rating: 4.8,
      duration: '60 minutes',
      price: 'LKR 300',
      icon: 'BookOpen',
      highlights: ['Indo-Saracenic dome', 'Rare Tamil manuscripts', 'Reflecting ponds', 'Guided architectural tours']
    },
    {
      name: 'Nagadeepa Purana Viharaya',
      description:
        'One of the sixteen sacred Buddhist sites reached by ferry to Nainativu Island. Combines gleaming stupas, Bodhi trees, and a serene lagoon setting.',
      image: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1600&q=80',
      category: 'Spiritual',
      rating: 4.7,
      duration: 'Half day',
      price: 'Boat ticket LKR 450',
      icon: 'Landmark',
      highlights: ['Island ferry ride', 'Ancient dagoba', 'Buddha footprints', 'Combine with Nallur & Nainativu Shakti Peedam']
    },
    {
      name: 'Delft (Neduntivu) Island',
      description:
        'A coral island sprinkled with wild horses, a 700-year-old baobab tree, Portuguese stables, and shallow turquoise reefs for snorkeling.',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
      category: 'Island',
      rating: 4.5,
      duration: 'Full day',
      price: 'Private charter from $55',
      icon: 'Ship',
      highlights: ['Wild dwarf horses', 'Coral walls', 'Giant baobab', 'Remote picnic beaches']
    },
    {
      name: 'Keerimalai Sacred Springs',
      description:
        'Twin bathing tanks where mineral springs meet the sea. Locals swear by the healing water and sunset views over the West-facing bay.',
      image: 'https://images.unsplash.com/photo-1482192597420-4817fdd7e8b0?auto=format&fit=crop&w=1600&q=80',
      category: 'Wellness',
      rating: 4.4,
      duration: '1 hour',
      price: 'LKR 200',
      icon: 'Droplets',
      highlights: ['Men & women pools', 'St. Anthony\'s church nearby', 'Sunset vantage point', 'Combine with Point Pedro']
    },
    {
      name: 'Point Pedro & Kudathanai Coast',
      description:
        'Sri Lanka\'s northernmost tip with a working lighthouse, coral reefs, and toddy-tapping villages framed by palmyrah silhouettes.',
      image: 'https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?auto=format&fit=crop&w=1600&q=80',
      category: 'Scenic',
      rating: 4.3,
      duration: 'Half day',
      price: 'Free',
      icon: 'Compass',
      highlights: ['Northernmost milestone', 'Palmyrah groves', 'Toddy huts', 'Off-grid photography']
    }
  ],
  activities: [
    {
      name: 'Island Hopping & Delft Expedition',
      description:
        'Private charter to Nainativu, Delft, and Kayts with a bilingual guide, gourmet picnic, snorkeling gear, and drone-friendly golden hours.',
      icon: 'Ship',
      price: 'From $185 per guest',
      duration: 'Full Day (10 hours)',
      popular: true
    },
    {
      name: 'Tamil Heritage Walking Circuit',
      description:
        'Sunrise walk covering Nallur Kovil, colonial streets, spice bazaars, and Rio ice cream with storytelling from local historians.',
      icon: 'Landmark',
      price: 'From $45',
      duration: '3.5 hours',
      popular: true
    },
    {
      name: 'Lagoon Sailing & Crab Harvest',
      description:
        'Crew a kattumaram across the Jaffna Lagoon, harvest blue swimmer crab, and enjoy a live cooking session with toddy pairings.',
      icon: 'Anchor',
      price: 'From $120',
      duration: '4 hours'
    },
    {
      name: 'Palmyrah Culinary Atelier',
      description:
        'Hands-on cooking class covering kool, odiyal kool, crab curry, and palmyrah jaggery sweets inside a restored mansion kitchen.',
      icon: 'UtensilsCrossed',
      price: 'From $70',
      duration: '4 hours'
    },
    {
      name: 'Sunset Cycling Peninsula Loop',
      description:
        'Guided 20km cycle through Karainagar causeways, toddy huts, and lagoon villages with support jeep and hydration stops.',
      icon: 'Bike',
      price: 'From $55',
      duration: '3 hours'
    },
    {
      name: 'Photography Masterclass',
      description:
        'Shoot blue-hour temples, fish markets, and island ferries with a National Geographic-featured photographer.',
      icon: 'Camera',
      price: 'From $95',
      duration: 'Sunrise or Sunset block'
    }
  ],
  restaurants: [
    {
      name: 'Malayan Cafe',
      description:
        'Iconic vegetarian canteen since 1954 serving temple-style meals, crab curry, and palmyrah jaggery sweets on banana leaves.',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80',
      cuisine: 'Tamil vegetarian & seafood specials',
      priceRange: '$',
      rating: 4.6,
      address: '49 Main Street, Jaffna Town',
      specialties: ['Jaffna kool', 'Crab curry', 'Idiyappam', 'Palmyrah treacle coffee'],
      openHours: '06:30 AM – 09:30 PM'
    },
    {
      name: 'CML (Cosy) Restaurant',
      description:
        'Family-run dining room known for its seafood thali, clay-pot curries, and courtyard ambience.',
      image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=1200&q=80',
      cuisine: 'Seafood & Sri Lankan',
      priceRange: '$$',
      rating: 4.4,
      address: '345 KKS Road, Jaffna',
      specialties: ['Seafood thali', 'Mutton varuval', 'Young jackfruit curry'],
      openHours: '11:00 AM – 10:00 PM'
    },
    {
      name: 'Jetwing Jaffna Sky Lounge',
      description:
        'Rooftop sundowner bar with tapas, spice-infused cocktails, and 360° views of Jaffna lagoon and skyline.',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
      cuisine: 'Tapas & mixology',
      priceRange: '$$$',
      rating: 4.7,
      address: 'Jetwing Jaffna, 37 Mahatma Gandhi Road',
      specialties: ['Spiced arrack cocktails', 'Lagoon prawn sliders', 'Vegan small plates'],
      openHours: '04:00 PM – Midnight'
    },
    {
      name: 'Rio Ice Cream & Faluda Bar',
      description:
        'Beloved dessert parlor where travelers cool off with palmyrah faluda, rose kulfi, and tropical sundaes after temple rounds.',
      image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1200&q=80',
      cuisine: 'Desserts & light bites',
      priceRange: '$',
      rating: 4.5,
      address: 'Gurunagar, Stanley Road',
      specialties: ['Palmyrah faluda', 'Rose & pistachio kulfi', 'Faluda milkshakes'],
      openHours: '10:00 AM – 11:00 PM'
    }
  ],
  hotels: [
    {
      name: 'Jetwing Jaffna',
      description:
        'Modern 55-room city hotel with skyline rooftop, curated excursions, EV transfers, and in-room palmyrah welcome treats.',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80',
      starRating: 4,
      priceRange: 'From $135 per night',
      amenities: ['Sky lounge', 'Concierge desk', 'Airport transfers', 'Fast Wi-Fi', '24/7 dining'],
      address: '37 Mahatma Gandhi Road, Jaffna',
      category: 'Contemporary City Hotel'
    },
    {
      name: 'Fox Resorts Jaffna',
      description:
        'Boutique bungalow estate blending colonial verandas, plunge pools, curated art, and candle-lit dinners.',
      image: 'https://images.unsplash.com/photo-1501117716987-c8e1ecb210cc?auto=format&fit=crop&w=1600&q=80',
      starRating: 4,
      priceRange: 'From $115 per night',
      amenities: ['Garden pool', 'Boutique spa', 'Cycling fleet', 'Chef\'s table', 'Library'],
      address: 'Lot 11, Puttur Road, Chundikuli',
      category: 'Boutique Heritage'
    },
    {
      name: 'The Thinnai',
      description:
        'Suite-only urban hideaway modeled after traditional thinnai courtyards with kitchenette suites and Ayurvedic pavilion.',
      image: 'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=1600&q=80',
      starRating: 4,
      priceRange: 'From $95 per night',
      amenities: ['Courtyard pool', 'Ayurveda spa', 'Butler pantry', 'Cultural shows'],
      address: '86 Palaly Road, Jaffna',
      category: 'All-suite Retreat'
    },
    {
      name: 'North Gate by Jetwing',
      description:
        'Towering hotel beside Jaffna Railway Station with rooftop infinity pool, work-ready rooms, and EV shuttle fleet.',
      image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80',
      starRating: 4,
      priceRange: 'From $105 per night',
      amenities: ['Infinity pool', 'Gym', 'EV shuttle', 'Business center'],
      address: 'Station Road, Jaffna',
      category: 'Business Luxe'
    }
  ],
  destinationInfo: {
    population: '88,000 (metro 650,000)',
    area: '1,025 km² peninsula',
    elevation: '3 m above sea level',
    bestTime: 'February – September (dry season)',
    language: 'Tamil & English widely spoken',
    currency: 'LKR (USD widely accepted for tours)'
  },
  weatherInfo: {
    temperature: '24°C – 33°C year-round',
    humidity: '70-80%',
    rainfall: 'Low Feb-Sep, NE monsoon Oct-Jan',
    season: 'Tropical dry zone',
    bestMonths: ['February', 'March', 'April', 'May', 'June', 'July', 'August', 'September'],
    packingTips: [
      'Lightweight breathable cotton + temple-ready shawls',
      'Sunscreen SPF 50+, reef-safe for island visits',
      'Slip-on footwear for temple visits',
      'Reusable water bottle & electrolytes',
      'Windbreaker for ferries & night cycling'
    ]
  },
  travelTips: [
    {
      title: 'Festival & Climate Planning',
      icon: 'Calendar',
      category: 'Seasonal',
      tips: [
        'Dry season (Feb–Sep) is ideal for ferries, casuarina swims, and cycling',
        'Book August Nallur Festival stays 6 months ahead',
        'Evenings get breezy—carry a light shawl for temple visits',
        'Rainy season (Oct–Jan) still offers uncrowded heritage tours'
      ],
      content: 'Align visits with dry-season ferries or plan around the August Nallur Festival for once-in-a-lifetime rituals.'
    },
    {
      title: 'Temple Etiquette & Attire',
      icon: 'Sparkles',
      category: 'Culture',
      tips: [
        'Cover shoulders and knees; men remove shirts inside Nallur sanctum',
        'Phones stay silent; photography requires explicit permission',
        'Carry a small offering (flowers or fruit) when entering kovils',
        'Remove shoes before stepping on raised temple platforms'
      ],
      content: 'Respectful attire and behavior keeps access open to photographers and travelers year after year.'
    },
    {
      title: 'Island Logistics',
      icon: 'Ship',
      category: 'Transport',
      tips: [
        'First Delft ferry departs Kurikadduwan Jetty at 8:00 AM—arrive 45 minutes prior',
        'Private charter boats are mandatory for reaching remote sandbars',
        'Carry national ID/passport for navy checkpoints',
        'Tuk-tuks accept cash only; we preload digital wallets for you'
      ],
      content: 'Recharge handles boat tickets, manifests, and local permits so you only focus on the views.'
    },
    {
      title: 'Food & Wellness',
      icon: 'Utensils',
      category: 'Wellness',
      tips: [
        'Toddy and palmyrah arrack are potent—sip slowly with food',
        'Hydrate frequently; northern sun is intense even on cloudy days',
        'Ask for medium spice if you are new to Jaffna flavours',
        'Pack antihistamines if you are sensitive to seafood'
      ],
      content: 'Northern cuisine is fiery and addictive—balance indulgence with hydration and cooling desserts.'
    }
  ],
  signatureTours: [
    {
      name: 'Northern Soul & Delft Wild Ponies',
      description:
        '3-day curated journey covering Nallur, Delft Island safari, and Point Pedro fishing hamlets with boutique stays and private charters.',
      image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1600&q=80',
      duration: '3 Days / 2 Nights',
      priceFrom: 'From $485 per guest',
      highlights: ['Private Delft charter & picnic', 'Toddy harvest & crab cookout', 'Point Pedro sunrise cycle', 'Boutique hotel stays'],
      includes: ['Airport transfers from CMB or JAF', 'Private vehicle & skipper', 'All meals & tastings', 'Dedicated concierge'],
      badge: 'Featured Journey',
      isBestSeller: true
    },
    {
      name: 'Sacred Nallur Immersion',
      description:
        'Two-day heritage immersion with backstage access to Nallur rituals, kovil music workshop, and curated vegetarian dining.',
      image: 'https://images.unsplash.com/photo-1524499982521-1ffd58dd89ea?auto=format&fit=crop&w=1600&q=80',
      duration: '2 Days / 1 Night',
      priceFrom: 'From $320 per guest',
      highlights: ['Private puja seating', 'Temple musician workshop', 'Silk saree styling', 'Sunrise heritage walk'],
      includes: ['Boutique hotel stay', 'Special permission & offerings', 'Bilingual host', 'Photo concierge'],
      badge: 'Limited Access'
    },
    {
      name: 'Lagoon Harvest & Culinary Weekend',
      description:
        'Hands-on weekend featuring palmyrah tapping, lagoon sailing, crab harvest, and a Michelin-style Tamil tasting menu by our chef collective.',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80',
      duration: '4 Days / 3 Nights',
      priceFrom: 'From $640 per guest',
      highlights: ['Private kattumaram sail', 'Chef-led cooking atelier', 'Palmyrah toddy tasting', 'Cycling through Karainagar'],
      includes: ['Luxury villa stay', 'All tastings & drinks', 'Recipe handbook', 'Photo & video pack']
    },
    {
      name: 'Jaffna & Mannar Coastal Circuit',
      description:
        'Explore the entire northern coastline, from Casuarina sands to Mannar baobab avenues, with conservation briefings and boutique stays.',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
      duration: '5 Days / 4 Nights',
      priceFrom: 'From $890 per guest',
      highlights: ['Casuarina & Talaimannar beaches', 'Baobab & donkey safaris', 'Wilpattu side-trip option', 'Night markets & craft workshops'],
      includes: ['Private guide & driver', 'Premium accommodation', 'Conservation donation', 'Flexible departure cities']
    }
  ],
  seo: {
    title: 'Jaffna Sri Lanka Tours | Delft Island, Nallur Temple & Northern Experiences',
    description:
      'Plan immersive Recharge Travels experiences across Jaffna—Tamil heritage walks, Delft Island day trips, lagoon sailing, boutique hotels, and concierge-run tours.',
    keywords: [
      'Jaffna tours',
      'Delft Island day trip',
      'Nallur temple festival',
      'Casuarina beach Sri Lanka',
      'Jaffna hotels',
      'Northern Sri Lanka itinerary',
      'Recharge Travels Jaffna',
      'Tamil culture experiences'
    ]
  },
  ctaSection: {
    title: 'Plan Your Northern Journey with Recharge Travels',
    subtitle: 'Our Jaffna-based concierge team arranges permits, private boats, and bilingual hosts so you simply arrive and immerse.',
    buttonText: 'Design My Jaffna Escape'
  },
  isPublished: true,
  updatedAt: null,
  createdAt: null
};
