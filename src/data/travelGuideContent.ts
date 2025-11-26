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
  // ============================================
  // DESTINATIONS
  // ============================================
  {
    id: 'destinations',
    name: 'Popular Destinations',
    icon: '🏖️',
    description: 'Explore Sri Lanka\'s most iconic destinations from ancient cities to pristine beaches',
    printable: true,
    sections: [
      {
        id: 'colombo',
        title: 'Colombo - The Commercial Capital',
        content: `Colombo, Sri Lanka's vibrant commercial capital, seamlessly blends modern urban development with rich colonial heritage. The city stretches along the coast, offering everything from high-end shopping malls to historic temples. Key districts include Fort (business center), Pettah (bustling market area), Cinnamon Gardens (upscale residential), and Mount Lavinia (beach suburb). The city serves as an excellent starting or ending point for your Sri Lankan journey, with international airport just 35km away.`,
        highlights: [
          'Galle Face Green - 5km oceanside urban park, sunset views, street food vendors',
          'National Museum - 170,000+ artifacts showcasing Sri Lankan heritage',
          'Gangaramaya Temple - stunning Buddhist temple with museum',
          'Pettah Market - labyrinthine bazaar for spices, textiles, electronics',
          'Dutch Hospital - colonial shopping and dining precinct',
          'Viharamahadevi Park - largest urban park, golden Buddha statue',
          'Independence Square - historic monument and cultural venue',
          'Colombo Harbour - one of the largest ports in South Asia'
        ],
        tips: [
          'Best time to visit: Year-round, but December-March for best weather',
          'Use Uber/PickMe apps for convenient, metered transport',
          'Try street food at Galle Face Green at sunset - crab, isso wade, kottu',
          'Visit temples early morning (6-8am) to avoid crowds and heat',
          'Explore Fort area on foot - British colonial architecture',
          'Stay in Kollupitiya or Bambalapitiya for central location',
          'Avoid rush hours (7-9am, 5-7pm) for travel',
          'Currency exchange best at banks in Fort area'
        ]
      },
      {
        id: 'kandy',
        title: 'Kandy - The Cultural Capital',
        content: `Kandy, nestled in the central highlands at 500m elevation, was the last capital of the ancient Sinhala kings before British colonization in 1815. This UNESCO World Heritage city is the spiritual heart of Buddhism in Sri Lanka, home to the sacred Temple of the Tooth Relic (Sri Dalada Maligawa). The city surrounds a beautiful artificial lake built by the last king, Sri Wickrama Rajasinghe. Kandy offers cooler temperatures, misty mountains, and is the gateway to the hill country and tea plantations.`,
        highlights: [
          'Temple of the Tooth - houses Buddha\'s sacred tooth relic',
          'Kandy Lake - scenic 3.4km walkway around the lake',
          'Royal Botanical Gardens Peradeniya - 60+ hectares, 4000+ plant species',
          'Bahirawakanda Vihara - giant white Buddha statue, panoramic views',
          'Udawattakele Forest Reserve - ancient forest, meditation trails',
          'Traditional Kandyan Dance - cultural shows every evening',
          'Ceylon Tea Museum - history of tea industry',
          'Gadaladeniya Temple - 14th century rock temple'
        ],
        tips: [
          'Attend evening puja at Temple of Tooth (6:30pm) - mesmerizing ritual',
          'Visit during Esala Perahera festival (July/August) - spectacular procession',
          'Book accommodation with lake or mountain views',
          'Dress code: White or light colors, shoulders and knees covered for temples',
          'Visit Peradeniya Gardens early morning to see orchids at best',
          'Take the scenic train from Colombo (3.5 hours) for best views',
          'Hire a guide at Temple of Tooth for historical context',
          'Try Kandy Muslim Hotel for authentic local biryani'
        ]
      },
      {
        id: 'galle',
        title: 'Galle - The Dutch Fort City',
        content: `Galle, located on the southwestern tip of Sri Lanka, is home to the best-preserved colonial sea fortress in South Asia. Built by the Portuguese in 1588 and extensively fortified by the Dutch in 1649, this UNESCO World Heritage Site is a living museum of colonial architecture. Today, the fort houses boutique hotels, art galleries, jewelry shops, cafes, and about 400 families who call it home. The contrast between ancient ramparts and trendy establishments makes Galle unique.`,
        highlights: [
          'Galle Fort walls - 3km walk with ocean views, best at sunset',
          'Dutch Reformed Church - built 1755, still holds services',
          'Galle Lighthouse - iconic landmark, oldest in Sri Lanka',
          'National Maritime Museum - naval artifacts and whale skeletons',
          'Old Dutch Hospital - colonial building, now restaurants and shops',
          'Historical Mansion Museum - Dutch period artifacts and gems',
          'Meera Mosque - 18th century mosque within fort walls',
          'Unawatuna Beach - just 5km away, excellent swimming'
        ],
        tips: [
          'Walk the fort walls at sunrise or sunset for best photos',
          'Stay inside the fort for authentic colonial experience',
          'Visit during Galle Literary Festival (January) for cultural events',
          'Join a free walking tour offered by local heritage guides',
          'Shop for handmade lace at Fort Printers and local artisan shops',
          'Book restaurants early for dinner - popular spots fill quickly',
          'Take day trips to Unawatuna, Jungle Beach, and Mirissa',
          'Watch stilt fishermen at Koggala (best at sunrise)'
        ]
      },
      {
        id: 'sigiriya',
        title: 'Sigiriya - The Lion Rock Fortress',
        content: `Sigiriya, often called the Eighth Wonder of the World, is a 5th-century rock fortress rising 200 meters from the central plains. Built by King Kashyapa (477-495 AD), this UNESCO World Heritage Site features ancient frescoes, mirror wall with ancient graffiti, landscaped gardens, and the remains of a royal palace at the summit. The climb involves 1,200 steps but rewards visitors with breathtaking 360-degree views. Nearby Pidurangala Rock offers an alternative climb with spectacular Sigiriya views.`,
        highlights: [
          'Sigiriya Frescoes - 5th century paintings of celestial maidens',
          'Mirror Wall - polished to reflect, covered in ancient poems',
          'Lion\'s Paw Entrance - massive carved lion paws at final ascent',
          'Summit Palace ruins - royal palace with views up to 50km',
          'Water Gardens - ancient hydraulic engineering marvel',
          'Boulder Gardens - massive boulders used as meditation caves',
          'Pidurangala Rock - neighboring rock with Sigiriya views',
          'Sigiriya Museum - artifacts and 3D reconstruction'
        ],
        tips: [
          'Start climbing at 7am opening - avoid midday heat and crowds',
          'Allow 3-4 hours for complete exploration',
          'Wear comfortable shoes - 1,200 steps each way',
          'Carry 2L water minimum, no shade on rock',
          'Beware of wasps near frescoes (follow guide instructions)',
          'Climb Pidurangala at sunrise for best Sigiriya photos',
          'Hire a licensed guide for historical insights (worth it!)',
          'Visit nearby Dambulla Cave Temple same day'
        ]
      },
      {
        id: 'ella',
        title: 'Ella - The Hill Country Gem',
        content: `Ella, a small mountain village at 1,041m elevation, has become one of Sri Lanka's most beloved destinations. Surrounded by tea plantations, cloud forests, and dramatic mountain scenery, Ella offers hiking trails, waterfalls, and the iconic Nine Arch Bridge. The scenic train journey to Ella (from Kandy or Nuwara Eliya) is considered one of the most beautiful train rides in the world, passing through tea estates, forests, and countless tunnels and bridges.`,
        highlights: [
          'Nine Arch Bridge - iconic colonial-era railway bridge',
          'Ella Rock - 3-hour hike with panoramic views',
          'Little Adam\'s Peak - easy 45-minute sunrise hike',
          'Ravana Falls - 25m waterfall, swimming pool at base',
          'Demodara Loop - unique railway engineering wonder',
          'Tea factory visits - see processing, taste fresh tea',
          'Scenic train ride - through tea country, book in advance',
          'Ella Gap - stunning valley views from town'
        ],
        tips: [
          'Book train tickets 30 days in advance for observation car',
          'Hike Little Adam\'s Peak for sunrise (5am start)',
          'Walk the railway track to Nine Arch Bridge safely',
          'Visit Nine Arch Bridge at train times (check schedule)',
          'Stay at least 2-3 nights to enjoy the pace',
          'Pack warm clothes - cool evenings year-round',
          'Try Ella Flower Garden Cafe for views and food',
          'Hire a tuk-tuk for full-day exploration (Rs 3000-4000)'
        ]
      },
      {
        id: 'nuwara-eliya',
        title: 'Nuwara Eliya - Little England',
        content: `Nuwara Eliya, at 1,868m elevation, was developed by British planters in the 19th century as a retreat from the coastal heat. Known as "Little England," it retains colonial-era architecture, a golf course, trout streams, and English gardens. The town is surrounded by the finest tea estates in the world, producing world-famous Ceylon High Grown Tea. The cool climate supports temperate vegetables and strawberry farms that supply much of Sri Lanka.`,
        highlights: [
          'Gregory Lake - pedal boats, horse rides, lakeside walks',
          'Victoria Park - English gardens, exotic flowers',
          'Horton Plains - UNESCO site, World\'s End cliff',
          'Pedro Tea Estate - one of highest tea factories',
          'Hakgala Botanical Gardens - temperate plants, misty setting',
          'Seetha Amman Temple - Ramayana trail site',
          'Lovers Leap Waterfall - tea estate waterfall viewpoint',
          'Golf Club - one of oldest golf courses in Asia (1889)'
        ],
        tips: [
          'Visit during April for Sinhala/Tamil New Year celebrations',
          'Book hotels early during April season',
          'Pack winter clothes - temperatures drop to 10°C at night',
          'Start Horton Plains trek at dawn (open 6am) for clear views',
          'Try fresh strawberries from local farms',
          'Visit tea factories for tastings and factory tours',
          'Take scenic drive via Ramboda Falls from Kandy',
          'Book colonial-era hotels like Grand or Hill Club for atmosphere'
        ]
      },
      {
        id: 'trincomalee',
        title: 'Trincomalee - Natural Harbour City',
        content: `Trincomalee, on the northeast coast, boasts one of the world's finest natural deep-water harbours. This ancient port city has been coveted by colonial powers for centuries and holds significant religious importance with Hindu temples perched on oceanside cliffs. The east coast beaches are best from May to September when the south experiences monsoons, offering pristine sand, whale watching, and world-class diving.`,
        highlights: [
          'Nilaveli Beach - 4km pristine white sand, calm waters',
          'Pigeon Island - national park, snorkeling with reef sharks',
          'Koneswaram Temple - cliff-top Hindu temple, ancient origins',
          'Fort Frederick - Dutch colonial fort, still military base',
          'Uppuveli Beach - beach bars, whale watching trips',
          'Hot Springs at Kanniya - seven natural hot water wells',
          'Whale watching - May to September season',
          'Marble Beach - secluded military-managed beach'
        ],
        tips: [
          'Best time to visit: May to September (dry season)',
          'Book whale watching early in season (May-June)',
          'Stay in Uppuveli for beach access and restaurants',
          'Snorkeling at Pigeon Island best March to October',
          'Visit Koneswaram Temple at sunset for views',
          'Try fresh crab at beach restaurants',
          'Rent a bicycle to explore between beaches',
          'Limited ATMs - carry enough cash'
        ]
      },
      {
        id: 'arugam-bay',
        title: 'Arugam Bay - Surfer\'s Paradise',
        content: `Arugam Bay, on the southeast coast, is internationally recognized as one of the world's top surfing destinations. This laid-back fishing village transforms during surf season (April-October) into a vibrant hub of surfers, yogis, and backpackers. Beyond surfing, the area offers safari opportunities at Kumana National Park, ancient temples, and lagoon safaris. The village maintains a rustic charm with thatched beach cabanas and fresh seafood restaurants.`,
        highlights: [
          'Main Point - world-class right-hand point break',
          'Baby Point - beginner-friendly waves',
          'Pottuvil Point - powerful waves for experts',
          'Whiskey Point - consistent beach break',
          'Kumana National Park - bird sanctuary, leopards',
          'Lagoon safaris - crocodiles, elephants, birds',
          'Muhudu Maha Viharaya - ancient Buddhist temple',
          'Panama village - traditional fishing culture'
        ],
        tips: [
          'Best surfing: April to October (June-August peak)',
          'Book accommodation early for peak season',
          'Rent boards locally - good quality available',
          'Take surf lessons at Baby Point if beginner',
          'Visit Kumana at dawn for best birdwatching',
          'Try fresh seafood BBQ at beachfront restaurants',
          'Roads from Colombo rough - fly to Batticaloa option',
          'Limited nightlife - bring entertainment'
        ]
      },
      {
        id: 'jaffna',
        title: 'Jaffna - The Cultural North',
        content: `Jaffna, the cultural capital of Sri Lankan Tamils, offers a distinctly different experience from the south. Accessible by road, rail, or air, this historic peninsula features grand Hindu temples, Dutch colonial architecture, palm-fringed islands, and unique cuisine. After decades of conflict ended in 2009, Jaffna has opened to tourism, revealing its rich heritage and warm hospitality. The region maintains strong connections to South India while being distinctly Sri Lankan.`,
        highlights: [
          'Jaffna Fort - massive Dutch fortification, largest in Asia',
          'Nallur Kandaswamy Temple - gold-topped Hindu temple',
          'Jaffna Library - rebuilt after destruction, cultural symbol',
          'Casuarina Beach - pristine northern beach',
          'Nagadeepa Island - sacred Buddhist and Hindu sites',
          'Delft Island - wild ponies, baobab trees, coral walls',
          'Keerimalai Springs - sacred healing pools',
          'Point Pedro - northernmost point of Sri Lanka'
        ],
        tips: [
          'Best time: January to September (avoid October-December monsoons)',
          'Take the scenic train from Colombo (6-8 hours)',
          'Dress modestly for Hindu temple visits',
          'Try Jaffna crab curry - regional specialty',
          'Visit Nallur Temple during evening puja',
          'Hire a tuk-tuk for island hopping',
          'Book boat to Nagadeepa early (limited departures)',
          'Learn few Tamil phrases - locals appreciate it'
        ]
      },
      {
        id: 'mirissa',
        title: 'Mirissa - Beach & Whale Watching Hub',
        content: `Mirissa, a crescent-shaped beach on the southern coast, has become synonymous with whale watching in Sri Lanka. From November to April, blue whales (the largest animals on Earth) and sperm whales migrate past this coast. The beach itself offers excellent swimming, surf breaks for beginners, and a vibrant nightlife scene. The iconic Parrot Rock provides dramatic sunset views over the bay.`,
        highlights: [
          'Whale watching - blue whales, sperm whales, dolphins',
          'Parrot Rock - iconic rock formation, sunrise/sunset views',
          'Mirissa Beach - swimming, surfing, nightlife',
          'Secret Beach - hidden gem, less crowded',
          'Coconut Tree Hill - Instagram-famous palm grove',
          'Fishing harbour - fresh catch, local atmosphere',
          'Whale watching museum - learn about local cetaceans',
          'Night market - food, crafts, entertainment'
        ],
        tips: [
          'Whale season: November to April (peak January-March)',
          'Book whale watching the night before (6am departures)',
          'Take seasickness medication 30 mins before boat trip',
          'Choose responsible whale watching operators',
          'Visit Coconut Tree Hill at sunrise to avoid crowds',
          'Stay at beach hotels for quick access to boats',
          'Try fresh grilled fish at beach restaurants',
          'Party scene at Doctor\'s House and other beach bars'
        ]
      }
    ]
  },

  // ============================================
  // WILDLIFE & SAFARI
  // ============================================
  {
    id: 'wildlife',
    name: 'Wildlife & Safari',
    icon: '🐘',
    description: 'Experience incredible wildlife from leopards to blue whales in diverse ecosystems',
    printable: true,
    sections: [
      {
        id: 'yala',
        title: 'Yala National Park - Leopard Capital',
        content: `Yala National Park, Sri Lanka's most visited wildlife park, holds the world's highest density of leopards per square kilometer. Located in the southeast, the park covers 979 sq km of varied habitats including monsoon forests, grasslands, marine wetlands, and beaches. Besides leopards, Yala is home to elephants, sloth bears, crocodiles, wild boar, spotted deer, and over 200 bird species. Block 1 is the main tourist area, while other blocks require special permits.`,
        highlights: [
          'Highest leopard density in the world (1 per sq km)',
          'Sri Lankan elephant herds - often 50+ together',
          'Sloth bear sightings - rare but possible',
          'Mugger crocodiles at waterholes',
          'Over 215 resident and migratory bird species',
          'Coastal lagoons with flamingos',
          'Ancient Buddhist pilgrimage site Sithulpawwa',
          'Scenic coastal drives along beaches'
        ],
        tips: [
          'Book morning safari (5:30am) for best leopard sightings',
          'Evening safaris (3pm) good for elephants at water',
          'Park closed in September for maintenance',
          'Stay at lodges near Palatupana gate for early entry',
          'Hire experienced tracker guide for better sightings',
          'Full-day safaris cover more ground',
          'Weekdays less crowded than weekends',
          'Bring binoculars, zoom camera, and patience'
        ]
      },
      {
        id: 'udawalawe',
        title: 'Udawalawe - Elephant Kingdom',
        content: `Udawalawe National Park, centered around a massive reservoir, is the best place in Sri Lanka to see wild elephants. With over 700 elephants, you're almost guaranteed multiple sightings. The open grasslands make wildlife easier to spot compared to dense jungle parks. The adjacent Elephant Transit Home rehabilitates orphaned elephants before release. Udawalawe offers a more relaxed safari experience than busy Yala.`,
        highlights: [
          '700+ wild elephants in the park',
          'Open grasslands for easy wildlife viewing',
          'Elephant Transit Home - orphan feeding times',
          'Udawalawe Reservoir - scenic backdrop',
          'Water buffalo, wild boar, spotted deer',
          'Over 180 bird species including endemic species',
          'Mugger crocodiles in reservoir',
          'Less crowded than Yala National Park'
        ],
        tips: [
          'Visit Elephant Transit Home at 9am, 12pm, 3pm, 6pm feeding',
          'Half-day safaris (3-4 hours) usually sufficient',
          'Best time: May to September (dry season gatherings)',
          'Open year-round unlike other parks',
          'Good base for Sinharaja and southern beaches',
          'Budget-friendly compared to luxury Yala lodges',
          'Elephant herds gather at reservoir in dry season',
          'Less waiting for leopards means more active safari'
        ]
      },
      {
        id: 'minneriya',
        title: 'Minneriya - The Gathering',
        content: `Minneriya National Park hosts "The Gathering" - one of the largest wild elephant congregations in the world. During dry months (June-September), up to 300 elephants gather around the ancient Minneriya reservoir built by King Mahasen in the 3rd century. This spectacular event occurs as water sources dry up elsewhere, drawing elephants from surrounding forests. The park is part of the Elephant Corridor connecting several reserves.`,
        highlights: [
          'The Gathering - up to 300 elephants (June-September)',
          'Ancient Minneriya reservoir (3rd century)',
          'Part of elephant migration corridor',
          'Endemic purple-faced langur monkeys',
          'Painted stork colonies',
          'Toque macaque troops',
          'Leopard and sloth bear (rare)',
          'Stunning sunset over reservoir'
        ],
        tips: [
          'Visit August-September for peak elephant gathering',
          'Afternoon safaris (3pm) best for gathering sightings',
          'Book jeeps from Habarana or Sigiriya',
          'Combine with Kaudulla NP (elephants move between parks)',
          'Check with rangers which park has more elephants that day',
          'Stay in Habarana for central location',
          'Half-day safari usually sufficient',
          'Photography best with afternoon golden light'
        ]
      },
      {
        id: 'wilpattu',
        title: 'Wilpattu National Park - Oldest Park',
        content: `Wilpattu, Sri Lanka's largest and oldest national park, is known for its unique natural lakes (villus) and high leopard population. Closed for 15 years during the civil conflict, it reopened in 2010 and remains less developed than southern parks. The park's dense jungle and villus create a different safari atmosphere. Wilpattu offers excellent chances for leopard and sloth bear sightings without the crowds of Yala.`,
        highlights: [
          'Sri Lanka\'s largest national park (1,317 sq km)',
          'Over 50 natural lakes (villus)',
          'High leopard density - less competition to view',
          'Sloth bear sightings more common here',
          'Sri Lankan sambar deer herds',
          'Bird watching - painted stork, spot-billed pelican',
          'Historical ruins within park',
          'Pristine wilderness experience'
        ],
        tips: [
          'Best time: February to October',
          'Closed September-October partially for maintenance',
          'Base yourself in Anuradhapura or Puttalam',
          'Full-day safaris recommended for deep exploration',
          'Less crowded - more exclusive wildlife viewing',
          'Morning safaris best for leopard',
          'Accommodation limited - book in advance',
          'Combine with Anuradhapura ancient city visit'
        ]
      },
      {
        id: 'whale-watching',
        title: 'Whale & Dolphin Watching',
        content: `Sri Lanka's position along major cetacean migration routes makes it one of the world's best whale watching destinations. Blue whales (largest animals ever), sperm whales, fin whales, and multiple dolphin species can be spotted. The southern coast (Mirissa) operates November-April, while the east coast (Trincomalee) offers May-October season, making Sri Lanka a year-round whale watching destination.`,
        highlights: [
          'Blue whales - up to 30m long, largest animal ever',
          'Sperm whales - deep divers, iconic tail flukes',
          'Spinner dolphins - acrobatic pods of hundreds',
          'Risso\'s dolphins - distinctive scarred appearance',
          'Pilot whales - social pods, curious behavior',
          'Bryde\'s whales - tropical residents',
          'Orca sightings - rare but documented',
          'Short distances from shore - 10-20km'
        ],
        tips: [
          'Mirissa season: November to April (peak Jan-March)',
          'Trincomalee season: May to October',
          'Book 6am departures for calm seas',
          'Take seasickness medication night before',
          'Choose responsible operators (no chasing whales)',
          'Bring sun protection, hat, water',
          'Cameras with zoom lens for best photos',
          'Trips typically 4-6 hours with breakfast included'
        ]
      },
      {
        id: 'sinharaja',
        title: 'Sinharaja Rainforest - UNESCO Biodiversity',
        content: `Sinharaja Forest Reserve, a UNESCO World Heritage Site, is Sri Lanka's last viable area of primary tropical rainforest. This biodiversity hotspot harbors remarkable endemic species - 95% of endemic birds, 50% of endemic mammals, and countless unique plants are found here. Walking through the dense forest with its towering trees, leeches, and bird flocks is a true rainforest experience.`,
        highlights: [
          'UNESCO World Heritage Site since 1988',
          '95% of Sri Lanka\'s endemic birds found here',
          'Mixed-species bird flocks - 20+ species together',
          'Purple-faced langur - endemic primate',
          'Giant squirrel - colorful tree dweller',
          'Over 60% of trees are endemic',
          'Medicinal plants used in traditional medicine',
          'Pristine lowland rainforest ecosystem'
        ],
        tips: [
          'Hire mandatory local guide at entrance',
          'Best time: January to April, August to September',
          'Start early (6am) for bird watching',
          'Bring leech socks - essential!',
          'Wear long sleeves and pants',
          'Rain gear essential - afternoon showers common',
          'Stay at eco-lodges near Deniyaya entrance',
          'Photography challenging in low light - high ISO needed'
        ]
      },
      {
        id: 'bundala',
        title: 'Bundala - Flamingo & Wetland Paradise',
        content: `Bundala National Park, a Ramsar Wetland of international importance, is Sri Lanka's premier birdwatching destination. The park's coastal lagoons attract thousands of greater flamingos (August-March), along with over 200 other bird species. The park also hosts elephants, crocodiles, and sea turtles on its beaches. Bundala offers a different experience from mammal-focused parks.`,
        highlights: [
          'Greater flamingos - up to 2,000 birds',
          'Over 200 bird species - resident and migratory',
          'Five shallow lagoons and sand dunes',
          'Sri Lankan elephants - small population',
          'Crocodiles at lagoon edges',
          'Sea turtles nesting on beaches',
          'Less crowded than nearby Yala',
          'Beautiful coastal scenery'
        ],
        tips: [
          'Best for flamingos: August to March',
          'Morning safaris (6am) best for birdwatching',
          'Bring binoculars - essential for birds',
          'Combine with Yala for complete wildlife experience',
          'Photography golden hour excellent here',
          'Half-day safaris sufficient',
          'Nearby Tissamaharama good base town',
          'Good alternative when Yala is closed/crowded'
        ]
      }
    ]
  },

  // ============================================
  // BEACHES & COASTAL
  // ============================================
  {
    id: 'beaches',
    name: 'Beaches & Coastal',
    icon: '🏝️',
    description: 'From surfing hotspots to secluded coves - discover Sri Lanka\'s stunning coastline',
    printable: true,
    sections: [
      {
        id: 'south-coast',
        title: 'Southern Coast Beaches',
        content: `Sri Lanka's southern coast stretches from Galle to Tangalle, offering diverse beach experiences. From the touristy Unawatuna to the secluded coves of Tangalle, there's something for everyone. The south coast season runs November to April when the Indian Ocean is calm and skies are clear. This area has the most developed tourist infrastructure with quality hotels, restaurants, and activities.`,
        highlights: [
          'Unawatuna - swimming, snorkeling, beach bars',
          'Mirissa - whale watching, surf, nightlife',
          'Weligama - learn to surf, stilt fishermen',
          'Hiriketiya - hidden bay, boutique hotels, surfing',
          'Tangalle - secluded beaches, turtle watching',
          'Dikwella - massive Buddha statue, local atmosphere',
          'Jungle Beach - snorkeling, cliff jumping',
          'Wijaya Beach - sea turtle conservation'
        ],
        tips: [
          'Best weather: November to April',
          'Book beachfront hotels 3-6 months ahead for peak season',
          'Rent scooters for coastal exploration (Rs 1500-2500/day)',
          'Try fresh seafood BBQ at beach restaurants',
          'Respect local customs - cover up away from beach',
          'Watch for stilt fishermen at Koggala/Weligama (sunrise)',
          'Visit turtle hatcheries for conservation experience',
          'Carry cash - beach areas have limited ATMs'
        ]
      },
      {
        id: 'east-coast',
        title: 'Eastern Coast Beaches',
        content: `The east coast offers pristine beaches with far fewer tourists. Season runs May to September when monsoons affect the south and west. Arugam Bay attracts surfers worldwide, while Pasikudah and Nilaveli offer calm, family-friendly swimming. This region was heavily affected by the 2004 tsunami and civil conflict, but has since rebuilt with a raw, authentic charm.`,
        highlights: [
          'Arugam Bay - world-class surfing destination',
          'Pasikudah - shallow warm water, family-friendly',
          'Nilaveli - pristine white sand, less developed',
          'Marble Beach - military-run, crystal clear water',
          'Kalkudah - quiet alternative to Pasikudah',
          'Pigeon Island - best snorkeling, baby sharks',
          'Dutch Bay - Trincomalee harbor views',
          'Uppuveli - beach bars, whale watching base'
        ],
        tips: [
          'Best weather: May to September',
          'Arugam Bay surf season: April to October',
          'Transport less available - hire driver or rent scooter',
          'Limited dining options - hotels often only choice',
          'Carry sufficient cash - fewer ATMs than south',
          'Book Pigeon Island snorkeling from Nilaveli',
          'East coast more conservative - dress modestly',
          'Check road conditions if driving from Colombo'
        ]
      },
      {
        id: 'west-coast',
        title: 'West Coast Beaches',
        content: `The west coast, from Colombo north to Kalpitiya, offers diverse experiences from urban beach escapes to remote kitesurfing lagoons. Negombo near the airport serves as a convenient first/last stop. Further north, Kalpitiya has emerged as a world-class kitesurfing destination with consistent winds and dolphin watching.`,
        highlights: [
          'Negombo - beach resort town near airport',
          'Mount Lavinia - Colombo\'s beach suburb',
          'Kalpitiya - kitesurfing, dolphin watching',
          'Bentota - water sports, luxury resorts',
          'Beruwala - quiet beach, mosque pilgrimage site',
          'Hikkaduwa - coral reef snorkeling, sea turtles',
          'Induruwa - turtle conservation, quiet beach',
          'Kalutara - Buddhist temple, river beaches'
        ],
        tips: [
          'Best weather: November to April',
          'Negombo good for airport stopover',
          'Kalpitiya kitesurfing: May to October (wind season)',
          'Hikkaduwa reef damaged - snorkeling less impressive now',
          'Bentota has best water sports facilities',
          'Train from Colombo runs along coast - scenic journey',
          'West coast more developed but also more touristy',
          'Avoid Negombo beach at night - not safe'
        ]
      },
      {
        id: 'surfing-guide',
        title: 'Surfing Guide Sri Lanka',
        content: `Sri Lanka offers excellent surfing for all levels. The main surf season in the south runs November to April, while the east coast (Arugam Bay) peaks April to October. With consistent swells, warm water (28°C year-round), and affordable living, Sri Lanka has become a top surf destination. Board rentals and lessons are widely available.`,
        highlights: [
          'Arugam Bay Main Point - world-class right-hand break',
          'Weligama Bay - ideal beginner waves',
          'Mirissa - beach break, good for learning',
          'Hiriketiya - consistent waves, all levels',
          'Hikkaduwa - reef breaks, experienced surfers',
          'Ahangama - The Rock, Kabalana breaks',
          'Whiskey Point - Arugam Bay beach break',
          'Pottuvil Point - powerful waves for experts'
        ],
        tips: [
          'South/West coast: November to April',
          'East coast (Arugam Bay): April to October',
          'Board rentals: Rs 500-1500 per day',
          'Lessons: Rs 3000-5000 for 2-hour session',
          'No wetsuit needed - water is warm',
          'Reef booties recommended for reef breaks',
          'Check with locals about currents and hazards',
          'Respect lineup etiquette - don\'t drop in'
        ]
      },
      {
        id: 'diving-snorkeling',
        title: 'Diving & Snorkeling',
        content: `Sri Lanka's waters offer diverse underwater experiences from coral reefs to shipwrecks. While the 2004 tsunami damaged some reefs, many excellent sites remain. Trincomalee, Batticaloa, and Hikkaduwa are main diving centers. Snorkeling is excellent at Pigeon Island, Hikkaduwa, and Unawatuna. Water visibility varies seasonally.`,
        highlights: [
          'Pigeon Island - best snorkeling, reef sharks',
          'HMS Hermes wreck - WWII aircraft carrier (Batticaloa)',
          'Bar Reef Marine Sanctuary - Kalpitiya',
          'Hikkaduwa coral reef - accessible from shore',
          'Colombo Harbour wrecks - historical dives',
          'Trincomalee - whale sharks (seasonal)',
          'Great Basses Reef - advanced divers',
          'Jungle Beach reef - easy access from Galle'
        ],
        tips: [
          'Best visibility: February to April (south), May to September (east)',
          'PADI courses widely available: $300-400 for Open Water',
          'Choose PADI-certified operators for safety',
          'Bring own mask if you have prescription',
          'Reef-safe sunscreen only - help protect coral',
          'Pigeon Island best March to October',
          'Book wreck dives in advance - limited boats',
          'Underwater cameras available for rent'
        ]
      }
    ]
  },

  // ============================================
  // CULTURE & HERITAGE
  // ============================================
  {
    id: 'culture',
    name: 'Culture & Heritage',
    icon: '🛕',
    description: 'Discover 2,500 years of civilization through ancient cities, temples, and living traditions',
    printable: true,
    sections: [
      {
        id: 'cultural-triangle',
        title: 'The Cultural Triangle',
        content: `The Cultural Triangle encompasses three UNESCO World Heritage Sites - Anuradhapura, Polonnaruwa, and Sigiriya - plus Kandy and Dambulla. This region represents the heart of ancient Sri Lankan civilization, with ruins dating back 2,500 years. A triangular route connects these sites, making it possible to explore in 3-5 days. The area showcases the engineering, artistic, and spiritual achievements of ancient Sinhalese kingdoms.`,
        highlights: [
          'Sigiriya - 5th century rock fortress, ancient frescoes',
          'Anuradhapura - sacred city, oldest recorded tree (2,300 years)',
          'Polonnaruwa - medieval capital, well-preserved ruins',
          'Dambulla Cave Temple - 2,000-year-old Buddhist art',
          'Mihintale - birthplace of Buddhism in Sri Lanka',
          'Ritigala - ancient monastery, forest ruins',
          'Aukana Buddha - 40ft standing Buddha statue',
          'Medirigiriya - circular Buddhist shrine (vatadage)'
        ],
        tips: [
          'Start early (7am) to avoid heat and crowds',
          'Hire licensed guides for historical context',
          'Cultural Triangle round ticket saves money',
          'Dress code: Cover shoulders and knees',
          'Carry water - sites are large with little shade',
          'Allow 3-5 days for complete exploration',
          'Stay in Habarana or Dambulla for central location',
          'Remove shoes and hats at religious sites'
        ]
      },
      {
        id: 'anuradhapura',
        title: 'Anuradhapura - Sacred Ancient City',
        content: `Anuradhapura, Sri Lanka's first capital (4th century BC to 11th century AD), is one of the oldest continuously inhabited cities in the world. As a UNESCO World Heritage Site, it contains massive dagobas (stupas), ancient monasteries, and the sacred Sri Maha Bodhi - the oldest documented tree on Earth, grown from a cutting of the tree under which Buddha attained enlightenment.`,
        highlights: [
          'Sri Maha Bodhi - oldest documented tree (2,300 years)',
          'Ruwanwelisaya - massive white dagoba',
          'Jetavanarama - once tallest brick structure on Earth',
          'Thuparama - oldest dagoba in Sri Lanka (3rd century BC)',
          'Isurumuniya - rock temple, famous lovers carving',
          'Abhayagiri Monastery - ancient Buddhist university',
          'Twin Ponds (Kuttam Pokuna) - ancient bathing pools',
          'Moonstone carvings - intricate entrance stones'
        ],
        tips: [
          'Hire bicycles to explore the extensive site',
          'Start at Sri Maha Bodhi for spiritual experience',
          'Wear white for temple visits (not mandatory but respectful)',
          'Bring offerings (lotus flowers, incense) for temples',
          'Evening puja at Sri Maha Bodhi is special',
          'Allow full day for main attractions',
          'New Town has hotels; Old Town is the sacred area',
          'Combine with nearby Mihintale (birthplace of Buddhism)'
        ]
      },
      {
        id: 'polonnaruwa',
        title: 'Polonnaruwa - Medieval Capital',
        content: `Polonnaruwa served as Sri Lanka's capital from the 11th to 13th centuries, a shorter period than Anuradhapura but leaving equally impressive ruins. The compact site is easier to explore and features well-preserved Hindu and Buddhist monuments. The Gal Vihara rock sculptures are considered masterpieces of Sri Lankan art.`,
        highlights: [
          'Gal Vihara - four magnificent rock-cut Buddha statues',
          'Royal Palace - 7-story ruins, audience hall',
          'Vatadage - circular relic house, moonstone carvings',
          'Lankatilaka - massive image house',
          'Rankoth Vehera - 55m high dagoba',
          'Shiva Devale temples - Hindu Chola architecture',
          'Parakrama Samudra - ancient irrigation reservoir',
          'Archaeological Museum - excellent artifact collection'
        ],
        tips: [
          'Rent bicycles at entrance (recommended)',
          'Early morning or late afternoon for best light',
          'More compact than Anuradhapura - half day possible',
          'Don\'t miss Gal Vihara - crown jewel of the site',
          'Visit museum first for historical context',
          'Swimming in Parakrama Samudra possible',
          'Good restaurants near main road entrance',
          'Combine with Minneriya safari in afternoon'
        ]
      },
      {
        id: 'dambulla',
        title: 'Dambulla Cave Temple',
        content: `Dambulla Cave Temple, a UNESCO World Heritage Site, consists of five caves filled with 153 Buddha statues and ceiling murals covering 2,100 square meters. The temple complex dates back to the 1st century BC when King Valagamba took refuge here. Perched on a rocky outcrop 160m above the surrounding plains, the caves offer both spiritual significance and panoramic views.`,
        highlights: [
          'Five caves with 153 Buddha statues',
          '2,100 sq m of painted ceiling murals',
          'Recumbent Buddha - 14m long carved from rock',
          'Ancient paintings depicting Buddha\'s life',
          'Panoramic views from temple entrance',
          'Golden Temple - modern addition at base',
          'Active pilgrimage site with daily rituals',
          'Oldest cave art in Sri Lanka'
        ],
        tips: [
          'Climb the 350 steps early morning to avoid heat',
          'Remove shoes at entrance - leave with shoe keeper',
          'Wear socks - ground can be hot in afternoon',
          'Photography allowed but no flash',
          'Visit Golden Temple (base) before or after main caves',
          'Best combined with Sigiriya (30 mins away)',
          'Modest dress required - cover shoulders and knees',
          'Monkeys can be aggressive - don\'t feed them'
        ]
      },
      {
        id: 'adam-peak',
        title: 'Adam\'s Peak - Sacred Pilgrimage',
        content: `Adam's Peak (Sri Pada) is a 2,243m mountain sacred to four religions. Buddhists believe it bears Buddha's footprint; Hindus claim it's Shiva's; Christians and Muslims associate it with Adam's first step after leaving Eden. The pilgrimage season (December-May) sees thousands climb the 5,500 steps through the night to witness sunrise from the summit. It's a challenging but profoundly moving experience.`,
        highlights: [
          'Sacred footprint at summit - revered by four religions',
          'Spectacular sunrise from 2,243m summit',
          '5,500 steps illuminated during season',
          'Tea plantations and cloud forests',
          'Pilgrims chanting "Sadhu sadhu" throughout climb',
          'Bell ringing tradition at summit',
          'Shadow of peak at sunrise - triangular phenomenon',
          'Buddhist full moon poya nights most sacred'
        ],
        tips: [
          'Season: December to May (clear skies)',
          'Start climb 2am-3am for sunrise (4-5 hours up)',
          'Bring warm layers - summit is cold and windy',
          'Flashlight/headlamp essential',
          'Pack snacks and water - limited availability',
          'Stay in Dalhousie/Nallathanniya village',
          'Full moon nights very crowded but special',
          'Off-season climbs possible but harder (no lights, shops closed)'
        ]
      },
      {
        id: 'religious-sites',
        title: 'Religious Sites & Temples',
        content: `Sri Lanka's religious landscape reflects its multicultural heritage. Buddhism dominates with stunning temples island-wide, but Hindu kovils, mosques, and churches also feature prominently. Religious tolerance is a national value, with temples often standing adjacent to kovils. Visitors are welcome at most religious sites with proper dress and behavior.`,
        highlights: [
          'Temple of the Tooth, Kandy - Buddha\'s tooth relic',
          'Kelaniya Raja Maha Viharaya - Buddha\'s visit site',
          'Nallur Kandaswamy, Jaffna - grand Hindu temple',
          'Kataragama - multi-faith pilgrimage site',
          'Munneswaram - ancient Hindu temple',
          'St. Anthony\'s Church, Colombo - colonial era',
          'Jami Ul-Alfar Mosque (Red Mosque), Colombo',
          'Nagadeepa - Buddhist and Hindu island temples'
        ],
        tips: [
          'Dress modestly: shoulders and knees covered',
          'Remove shoes before entering temples',
          'Women may need to cover heads at mosques',
          'Avoid pointing feet at Buddha images',
          'Ask permission before photographing ceremonies',
          'Donations appreciated but not required',
          'Full moon (poya) days see extra temple activity',
          'Never pose with back to Buddha for photos'
        ]
      }
    ]
  },

  // ============================================
  // RAMAYANA TRAIL
  // ============================================
  {
    id: 'ramayana',
    name: 'Ramayana Trail',
    icon: '🏛️',
    description: 'Follow the epic footsteps of the Ramayana across Sri Lanka\'s sacred landscapes',
    printable: true,
    sections: [
      {
        id: 'ramayana-intro',
        title: 'The Ramayana Connection to Sri Lanka',
        content: `Sri Lanka (ancient Lanka) plays a central role in the Hindu epic Ramayana. According to the epic, the demon king Ravana abducted Princess Sita and held her captive in Lanka until Lord Rama's army crossed from India to rescue her. Many sites across Sri Lanka are associated with these events, creating a pilgrimage trail for devotees and a fascinating cultural tour for others.`,
        highlights: [
          'Lanka identified as Ravana\'s kingdom in the epic',
          'Sites spanning the entire island',
          'Believed locations of Sita\'s captivity',
          'Hanuman\'s landing and search sites',
          'Battle locations from the epic',
          'Ravana\'s airports and palaces',
          'Active Hindu pilgrimage circuit',
          'Blend of mythology and archaeology'
        ],
        tips: [
          'Hire guide specialized in Ramayana trail',
          '5-7 days needed for complete trail',
          'Sites are spread across the island',
          'Combine with general sightseeing',
          'Hindu pilgrims prefer specific puja dates',
          'Many sites in scenic hill country',
          'Respect religious significance of sites',
          'Some sites have limited facilities'
        ]
      },
      {
        id: 'sita-sites',
        title: 'Sites of Sita\'s Captivity',
        content: `Several locations in Sri Lanka are associated with Sita's captivity during her abduction by Ravana. These sites, primarily in the central highlands, are believed to be places where Sita was held or bathed during her time in Lanka. The Seetha Amman Temple in Nuwara Eliya is the most significant of these sites.`,
        highlights: [
          'Seetha Amman Temple - where Sita was kept by Ravana',
          'Sita Eliya - name meaning "Sita\'s light"',
          'Hakgala Gardens - Ravana\'s pleasure garden for Sita',
          'Divurumpola - where Sita proved her purity by fire',
          'Sita Pokuna - where Sita bathed',
          'Ashok Vatika - grove where Sita was kept',
          'Ravana\'s stream marks near Seetha Amman',
          'Hanuman footprints at Sita temple'
        ],
        tips: [
          'Seetha Amman Temple conducts daily pujas',
          'Combine with Nuwara Eliya sightseeing',
          'Hakgala Gardens beautiful for general visit',
          'Local guides can explain legends at each site',
          'Modest dress required at temple sites',
          'Photography usually permitted outside shrines',
          'Best visited as a circuit from Nuwara Eliya',
          'Pilgrims perform rituals - observe respectfully'
        ]
      },
      {
        id: 'ravana-sites',
        title: 'Ravana\'s Kingdom Sites',
        content: `As the legendary demon king of Lanka, Ravana is associated with numerous sites across Sri Lanka. These include his palaces, airports, caves, and finally his battlefield with Rama. The stunning Ravana Falls near Ella is named after him, and the Ravana Cave in the same area is said to have been his hideout.`,
        highlights: [
          'Ravana Falls - 25m waterfall named after king',
          'Ravana Cave (Ravana Ella Cave) - legendary hideout',
          'Sigiriya - sometimes identified as Ravana\'s palace',
          'Weragantota - Ravana\'s airport (Wariyapola)',
          'Ussangoda - another alleged airport, red earth site',
          'Rumassala - Hanuman dropped herbs here',
          'Dunuwila - battlefield location',
          'Adam\'s Bridge - Rama\'s army crossing point'
        ],
        tips: [
          'Ravana Falls and cave easily visited from Ella',
          'Swimming possible at base of Ravana Falls',
          'Ravana Cave requires short hike',
          'Adam\'s Bridge visible from Talaimannar (needs permit)',
          'Ussangoda has unusual red landscape worth visiting',
          'Rumassala in Unawatuna has medicinal plants',
          'Sites make interesting alternative sightseeing angle',
          'Local legends vary - multiple stories at each site'
        ]
      },
      {
        id: 'ramayana-temples',
        title: 'Ramayana Trail Temples',
        content: `Several Hindu temples in Sri Lanka are directly connected to Ramayana events or characters. These temples are active places of worship and welcome respectful visitors. The Munneswaram and Manavari temples near Chilaw are among the oldest, while Kataragama is sacred to both Buddhists and Hindus.`,
        highlights: [
          'Munneswaram Temple - built by Rama after defeating Ravana',
          'Manavari Temple - where Rama worshipped Shiva',
          'Thiru Koneswaram, Trincomalee - cliff-top temple',
          'Ketheeswaram, Mannar - ancient Shiva temple',
          'Seetha Amman Temple - dedicated to Sita',
          'Kataragama - Skanda (Murugan) worship site',
          'Chilaw temples - Rama purification sites',
          'Panchamukha Anjaneya (five-faced Hanuman)'
        ],
        tips: [
          'Temple dress code: cover legs and shoulders',
          'Remove shoes before entering',
          'Photography rules vary - ask permission',
          'Hindu festivals see special celebrations',
          'Munneswaram festival in August impressive',
          'Early morning or evening for fewer crowds',
          'Donations appreciated but never required',
          'Prasadam (blessed food) offered to visitors'
        ]
      }
    ]
  },

  // ============================================
  // AYURVEDA & WELLNESS
  // ============================================
  {
    id: 'ayurveda',
    name: 'Ayurveda & Wellness',
    icon: '🧘',
    description: 'Ancient healing traditions and wellness retreats for body, mind, and spirit',
    printable: true,
    sections: [
      {
        id: 'ayurveda-intro',
        title: 'Ayurveda in Sri Lanka',
        content: `Sri Lanka has a 3,000-year tradition of Ayurveda, the ancient Indian system of medicine and wellness. The island's unique botanical diversity provides over 1,400 medicinal plants used in Ayurvedic treatments. From luxury spa retreats to traditional village practitioners, Sri Lanka offers authentic Ayurvedic experiences. Many visitors combine beach holidays with dedicated wellness programs.`,
        highlights: [
          '3,000+ years of Ayurvedic tradition',
          'Over 1,400 native medicinal plants',
          'Government-certified Ayurvedic hospitals',
          'Luxury wellness resorts island-wide',
          'Traditional practitioners in villages',
          'Herbal gardens and medicine factories',
          'Panchakarma detox programs',
          'Wellness tourism growing rapidly'
        ],
        tips: [
          'Book authentic retreats 2-3 months ahead',
          'Minimum 7-14 days for proper treatment',
          'Consult doctor if you have medical conditions',
          'Follow dietary restrictions during treatment',
          'Some treatments require abstaining from beach/sun',
          'Government-registered practitioners safest choice',
          'Carry list of any medications you take',
          'Expect gradual results - not instant fixes'
        ]
      },
      {
        id: 'wellness-retreats',
        title: 'Wellness Retreats & Spas',
        content: `Sri Lanka hosts numerous world-class wellness retreats combining Ayurveda with yoga, meditation, and healthy cuisine. From beachside resorts to mountain hideaways, these retreats offer comprehensive programs for detox, weight management, stress relief, and chronic condition management. Most cater to international guests with English-speaking practitioners.`,
        highlights: [
          'Barberyn Reef - pioneering Ayurveda resort',
          'Siddhalepa Ayurveda Resort - heritage brand',
          'Santani Wellness - luxury mountain retreat',
          'Ayurveda Pavilions - boutique beach property',
          'Jetwing Ayurveda Pavilions - comprehensive programs',
          'Ulpotha - yoga village experience',
          'Talalla Retreat - surf and yoga combo',
          'Sen Wellness Sanctuary - remote jungle setting'
        ],
        tips: [
          'High season (November-April) books up fast',
          'All-inclusive packages usually best value',
          'Expect early mornings and early bedtimes',
          'Some retreats restrict phones/electronics',
          'Yoga levels vary - inform about your experience',
          'Vegetarian/vegan meals typical during retreats',
          'Transportation from airport usually included',
          'Follow-up treatments available locally'
        ]
      },
      {
        id: 'treatments-explained',
        title: 'Common Ayurvedic Treatments',
        content: `Ayurvedic treatments aim to balance the body's three doshas (Vata, Pitta, Kapha) through oils, herbs, diet, and lifestyle. Treatments range from relaxing massages to intensive cleansing programs. Understanding what to expect helps you choose appropriate treatments for your goals.`,
        highlights: [
          'Abhyanga - synchronized two-therapist oil massage',
          'Shirodhara - warm oil poured on forehead',
          'Panchakarma - 5-step deep cleansing program',
          'Udvartana - herbal powder massage',
          'Navarakizhi - rice pudding massage',
          'Pizhichil - oil bath treatment',
          'Nasya - nasal cleansing treatment',
          'Herbal steam bath - sweating therapy'
        ],
        tips: [
          'Shirodhara deeply relaxing - don\'t plan activities after',
          'Panchakarma requires 14-21 day commitment',
          'Inform therapists of allergies or sensitivities',
          'Some treatments use mustard or sesame oil',
          'Wear old/dark clothes during treatments',
          'Rest after treatments - avoid swimming/sun',
          'Herbal drinks may have strong tastes',
          'Results build over multiple sessions'
        ]
      },
      {
        id: 'yoga-meditation',
        title: 'Yoga & Meditation',
        content: `Beyond Ayurveda, Sri Lanka offers excellent yoga and meditation experiences. From drop-in classes at beach towns to intensive meditation retreats at Buddhist monasteries, options suit all levels. The peaceful environment, spiritual heritage, and natural beauty create ideal conditions for inner exploration.`,
        highlights: [
          'Yoga retreats in Ella, Mirissa, Unawatuna, Arugam Bay',
          'Vipassana meditation centers (10-day courses)',
          'Buddhist meditation monasteries accepting foreigners',
          'Sunrise yoga on beaches',
          'Teacher training courses (200-hour, 500-hour)',
          'Mindfulness retreats in hill country',
          'Combined surf and yoga programs',
          'Wellness festivals and workshops'
        ],
        tips: [
          'Vipassana courses free but book months ahead',
          'Bring own yoga mat for drop-in classes',
          'Early morning (6am) yoga best in tropics',
          'Many cafes/hotels offer casual yoga classes',
          'Meditation retreats may require silence',
          'Teacher training requires existing practice',
          'Modest clothing for traditional settings',
          'Buddhist sites have strict rules - research first'
        ]
      }
    ]
  },

  // ============================================
  // FOOD & CUISINE
  // ============================================
  {
    id: 'food',
    name: 'Food & Cuisine',
    icon: '🍛',
    description: 'Savor the flavors of Sri Lanka - from fiery curries to sweet tropical treats',
    printable: true,
    sections: [
      {
        id: 'must-try-dishes',
        title: 'Must-Try Sri Lankan Dishes',
        content: `Sri Lankan cuisine is renowned for its bold flavors, aromatic spices, and generous use of coconut. Rice and curry is the staple, but the variety of curries served alongside makes each meal an adventure. From spicy sambols to cooling chutneys, the complexity of flavors will delight food lovers. Vegetarian options are abundant thanks to Buddhist influence.`,
        highlights: [
          'Rice and Curry - national dish, 5-8 curries typically',
          'Hoppers (Appa) - bowl-shaped fermented rice pancakes',
          'String Hoppers (Idiappam) - steamed rice noodles',
          'Kottu Roti - chopped roti stir-fried with vegetables/meat',
          'Lamprais - Dutch-influenced rice parcels',
          'Fish Ambul Thiyal - sour spiced fish curry',
          'Pol Sambol - spicy coconut relish',
          'Watalappam - coconut jaggery custard'
        ],
        tips: [
          'Ask for "less chili" if you\'re not used to spice',
          'Try hotel breakfast buffets for variety of local dishes',
          'Street food safe in busy areas with high turnover',
          'Vegetarian options widely available ("no fish, no meat")',
          'Sunday rice and curry lunches are special',
          'Fresh seafood best on coastal towns',
          'Eating with right hand is traditional but utensils available',
          'Local restaurants cheaper than tourist ones - same food'
        ]
      },
      {
        id: 'street-food',
        title: 'Street Food Guide',
        content: `Sri Lankan street food offers delicious snacks throughout the day. From morning rolls to evening kottu, street vendors serve quick, tasty, and very affordable food. Galle Face Green in Colombo is famous for its evening street food scene, but you'll find vendors in every town.`,
        highlights: [
          'Isso Wade - crispy lentil patties with prawns',
          'Rolls - spiced fish/chicken wrapped in thin pancake',
          'Samosas - triangular spiced vegetable/meat pastries',
          'Vadai - savory lentil donuts',
          'Egg Hoppers - hopper with egg cooked in center',
          'Kottu Roti - chopped roti (hear the rhythmic chopping)',
          'Parippu Wade - spicy lentil fritters',
          'Fruit with chili salt - tropical fruits street-style'
        ],
        tips: [
          'Look for busy stalls with high turnover',
          'Evening is best time for street food',
          'Galle Face Green (Colombo) has excellent variety',
          'Prices typically Rs 50-200 per item',
          'Watch food being prepared fresh',
          'Carry hand sanitizer for before/after eating',
          'Kottu vendors make rhythmic chopping sounds - follow the sound',
          'Try fruit with salt and chili - surprisingly delicious'
        ]
      },
      {
        id: 'tea-culture',
        title: 'Ceylon Tea Experience',
        content: `As one of the world's largest tea exporters, Sri Lanka offers unique tea experiences. From plantation visits in the misty highlands to professional tastings, tea culture is integral to Sri Lankan identity. "Ceylon Tea" remains a globally recognized brand, and visiting tea country reveals the labor and expertise behind each cup.`,
        highlights: [
          'Tea factory tours - see production process',
          'Tea plucking experiences - try picking leaves',
          'Professional tea tastings - learn to distinguish grades',
          'High tea at colonial hotels',
          'Pedro, Mackwoods, Mlesna estates',
          'Different elevation = different flavors',
          'Tea museum in Kandy',
          'Purchase directly from estates'
        ],
        tips: [
          'Best tea regions: Nuwara Eliya, Ella, Haputale',
          'Factory tours usually free with tea purchase',
          'Morning hours best for active factories',
          'High grown (above 1200m) tea most prized',
          'BOPF, BOP, Orange Pekoe are grade names',
          'Try tea plain first to taste true flavor',
          'Fresh tea from estates best quality and value',
          'Tea plucking harder than it looks - respect workers'
        ]
      },
      {
        id: 'spices-cooking',
        title: 'Spices & Cooking Classes',
        content: `Sri Lankan cuisine relies on a complex blend of spices grown on the island - cinnamon, cardamom, cloves, pepper, and more. Spice gardens in the central region offer tours explaining traditional uses. Cooking classes teach you to recreate Sri Lankan flavors at home.`,
        highlights: [
          'True Ceylon Cinnamon - different from cassia',
          'Pepper vines - black, white, and green peppercorns',
          'Cardamom, cloves, nutmeg, mace',
          'Curry leaves - essential fresh ingredient',
          'Goraka - sour dried fruit for fish curries',
          'Pandan leaves - aromatic rice and desserts',
          'Cooking classes in hotels and homes',
          'Matale spice gardens (central region)'
        ],
        tips: [
          'Buy spices from reputable gardens, not roadside vendors',
          'True cinnamon costs more but worth it',
          'Fresh ground spices more aromatic than pre-packaged',
          'Cooking classes typically 3-4 hours, Rs 3000-5000',
          'Many hotels offer cooking demonstrations',
          'Ask about taking recipe cards home',
          'Vacuum-packed spices last longer for travel',
          'Learn to identify real vs fake cinnamon'
        ]
      },
      {
        id: 'drinks-beverages',
        title: 'Drinks & Beverages',
        content: `Beyond world-famous Ceylon tea, Sri Lanka offers refreshing beverages suited to the tropical climate. From fresh king coconut water to locally brewed arrack, there's plenty to drink. Alcohol is available but expensive due to high taxes and restricted in certain areas.`,
        highlights: [
          'King Coconut (Thambili) - orange coconut, natural electrolytes',
          'Ceylon Tea - served sweet with milk, or plain',
          'Woodapple Juice - unique tart flavor',
          'Faluda - rose milk drink with seeds',
          'Fresh fruit juices - papaya, pineapple, mango',
          'Ginger Beer - local carbonated favorite',
          'Arrack - coconut flower toddy distillate',
          'Lion Lager - national beer brand'
        ],
        tips: [
          'King coconuts sold on roadside - fresh and safe',
          'Alcohol only from licensed shops (wine stores)',
          'Poya days (full moon) alcohol sales prohibited',
          'Hotels exempt from poya alcohol restrictions',
          'Arrack best quality: DCSL or Rockland brands',
          'Avoid bootleg alcohol - dangerous',
          'Mix arrack with ginger beer for classic cocktail',
          'Bottled water widely available and cheap'
        ]
      }
    ]
  },

  // ============================================
  // PRACTICAL INFORMATION
  // ============================================
  {
    id: 'practical',
    name: 'Practical Information',
    icon: 'ℹ️',
    description: 'Essential travel tips for a smooth Sri Lanka journey - visas, health, money, and more',
    printable: true,
    sections: [
      {
        id: 'visa-arrival',
        title: 'Visa & Entry Requirements',
        content: `Most visitors need an Electronic Travel Authorization (ETA) before arrival. The ETA system is straightforward and approval usually comes within 24 hours. The standard tourist visa allows 30 days, extendable to 90 days within Sri Lanka. Some nationalities have different requirements - always check current regulations before travel.`,
        highlights: [
          'ETA required for most nationalities',
          'Apply online at eta.gov.lk',
          'Cost: $35 USD for tourism',
          '30-day tourist visa on arrival with ETA',
          'Extension to 90 days possible in Colombo',
          'Passport validity: 6 months minimum',
          'Return/onward ticket may be requested',
          'Yellow fever certificate if from endemic area'
        ],
        tips: [
          'Apply for ETA at least 48 hours before travel',
          'Keep printed and digital copy of ETA approval',
          'Immigration queues vary - allow 30-60 mins',
          'Extend visa at Immigration Dept, Colombo before expiry',
          'Overstaying results in fines and complications',
          'Business and transit ETAs have different costs',
          'Children need their own ETA',
          'Indian nationals can get free visa for 30 days'
        ]
      },
      {
        id: 'best-time-visit',
        title: 'Best Time to Visit',
        content: `Sri Lanka's climate varies by region, meaning somewhere is always in season. The island has two monsoon seasons affecting opposite coasts. Understanding this helps plan your itinerary to maximize good weather. Generally, the southwest is best November-April, while the east is best May-September.`,
        highlights: [
          'Southwest coast: November to April (dry season)',
          'East coast: May to September (dry season)',
          'Hill country: January to April (best weather)',
          'Cultural Triangle: year-round (hot, afternoon rain)',
          'Whale watching Mirissa: November to April',
          'Whale watching Trincomalee: May to October',
          'Surfing Arugam Bay: April to October',
          'Surfing south coast: November to April'
        ],
        tips: [
          'Shoulder seasons (April/May, October/November) offer lower prices',
          'December-January peak season - book well ahead',
          'Monsoons bring afternoon storms, not all-day rain',
          'Pack for all weather - layers for hill country',
          'School holidays (April, August, December) busy locally',
          'Esala Perahera (Kandy) July/August is spectacular but crowded',
          'Avoid April New Year week if not celebrating - country shuts down',
          'Climate change making patterns less predictable'
        ]
      },
      {
        id: 'health-safety',
        title: 'Health & Safety',
        content: `Sri Lanka is generally safe for tourists with good healthcare in urban areas. The main health concerns are sun exposure, mosquito-borne diseases, and occasional stomach issues from new foods. With basic precautions, most visitors stay healthy throughout their trip.`,
        highlights: [
          'No mandatory vaccinations (except yellow fever from endemic areas)',
          'Hepatitis A and Typhoid recommended',
          'Dengue fever present - mosquito prevention important',
          'Good private hospitals in Colombo, Kandy, Galle',
          'Pharmacies well-stocked and pharmacists helpful',
          'Sun and heat precautions essential',
          'Water safety - stick to bottled/boiled',
          'Travel insurance highly recommended'
        ],
        tips: [
          'Use mosquito repellent with DEET, especially at dusk',
          'Dengue mosquitoes bite during day - all-day protection needed',
          'Drink only bottled or boiled water',
          'Avoid ice in drinks from questionable sources',
          'Let stomach adjust - start with lighter foods',
          'Carry basic first aid kit',
          'Sun stronger than expected - use SPF 50+',
          'Save emergency numbers: Police 119, Ambulance 110'
        ]
      },
      {
        id: 'money-costs',
        title: 'Money & Budget',
        content: `The Sri Lankan Rupee (LKR) is the local currency. The economic situation has caused inflation, so prices may vary from published information. ATMs are widespread, credit cards accepted at hotels and larger restaurants. Carrying cash is essential for smaller establishments, transport, and rural areas.`,
        highlights: [
          'Currency: Sri Lankan Rupee (LKR)',
          'ATMs available in cities and towns',
          'Credit/debit cards at tourist establishments',
          'Exchange at banks or authorized dealers',
          'Tipping: 10% at restaurants if not included',
          'Budget: $30-50/day for budget travel',
          'Mid-range: $50-150/day',
          'Luxury: $150-500+/day'
        ],
        tips: [
          'ATMs have daily withdrawal limits - carry backup cash',
          'Exchange money at banks for best rates',
          'Small shops and tuk-tuks need cash only',
          'Keep small denominations for tips and transport',
          'Bargaining expected at markets, not fixed shops',
          'Round up taxi/tuk-tuk fares for tip',
          'Hotel staff tips: Rs 200-500 depending on service',
          'Check if service charge included before tipping'
        ]
      },
      {
        id: 'transport',
        title: 'Getting Around',
        content: `Sri Lanka offers various transport options from scenic trains to air-conditioned private cars. The choice depends on budget, comfort preferences, and time available. Trains are economical and scenic but slow. Hiring a private driver provides flexibility and local knowledge. Domestic flights connect major destinations quickly.`,
        highlights: [
          'Trains - scenic, cheap, but book ahead for good seats',
          'Buses - extensive network, very cheap, can be crowded',
          'Private drivers - comfortable, flexible, $50-80/day',
          'Tuk-tuks - short city trips, agree price first',
          'Domestic flights - Colombo to Jaffna, Batticaloa',
          'PickMe/Uber apps - metered taxis in cities',
          'Rental cars - available but traffic challenging',
          'Intercity taxis - fixed prices, air-conditioned'
        ],
        tips: [
          'Book train tickets 30 days ahead for popular routes',
          'Colombo-Kandy and Kandy-Ella trains very scenic',
          'Observation car tickets sell out fast',
          'Private drivers can become guides - tip well',
          'Tuk-tuks: always agree price before getting in',
          'PickMe app reliable for fair taxi prices',
          'Driving is left-side (UK style) - challenging for visitors',
          'Internal flights save time but limited schedule'
        ]
      },
      {
        id: 'packing',
        title: 'What to Pack',
        content: `Sri Lanka's tropical climate requires light, breathable clothing, but temples require modest dress. The hill country gets cool, especially at night. Essentials include sun protection, insect repellent, and comfortable walking shoes. Most items available locally if forgotten.`,
        highlights: [
          'Light, breathable cotton/linen clothes',
          'Modest clothing for temples (cover shoulders, knees)',
          'Light jacket/sweater for hill country',
          'Comfortable walking shoes for temple visits',
          'Sandals/flip-flops for beaches',
          'Sunscreen, sunglasses, hat',
          'Insect repellent with DEET',
          'Rain jacket or umbrella (afternoon showers)'
        ],
        tips: [
          'Sarongs useful as temple cover-up, beach towel, etc.',
          'White/light colors preferred for temple visits',
          'Waterproof bag for electronics',
          'Power adapter - UK-style 3-pin plugs',
          'Basic first aid kit with stomach remedies',
          'Leave expensive jewelry at home',
          'Quick-dry clothes useful in humid climate',
          'Leech socks if planning jungle treks'
        ]
      },
      {
        id: 'etiquette',
        title: 'Local Customs & Etiquette',
        content: `Sri Lankan culture blends Buddhist, Hindu, and colonial influences. Understanding local customs helps avoid unintentional offense and enables deeper connections with locals. Sri Lankans are generally forgiving of tourist mistakes but appreciate efforts to respect their culture.`,
        highlights: [
          'Remove shoes before entering homes and temples',
          'Dress modestly at religious sites',
          'Never turn back to Buddha statues for photos',
          'Ask permission before photographing people',
          'Use right hand for eating and giving/receiving',
          'Avoid public displays of affection',
          'Head is sacred - don\'t touch others\' heads',
          'Pointing with finger considered rude'
        ],
        tips: [
          'Learn "Ayubowan" (may you live long) - traditional greeting',
          'Slight nod/bow shows respect to elders',
          'Gift-giving: sweets, fruits, or flowers appropriate',
          'Don\'t photograph military installations',
          'Full moon (poya) days are public holidays',
          'Shorts acceptable at beaches but not towns',
          'Be patient - "Sri Lankan time" is flexible',
          'Smile goes a long way - Sri Lankans are friendly'
        ]
      },
      {
        id: 'connectivity',
        title: 'Internet & Communication',
        content: `Sri Lanka has good mobile and internet connectivity in most areas. Purchasing a local SIM card is easy, cheap, and provides data for maps, translation, and communication. WiFi is available at most hotels and cafes, though speeds vary.`,
        highlights: [
          'Mobile networks: Dialog, Mobitel, Airtel, Hutch',
          'SIM cards available at airport on arrival',
          'Tourist SIM packages with data starting ~$5',
          'Coverage good in populated areas',
          'WiFi at most hotels and restaurants',
          'International roaming expensive - get local SIM',
          '4G available in cities and tourist areas',
          'WhatsApp widely used for local communication'
        ],
        tips: [
          'Buy SIM at airport arrival hall - quick setup',
          'Bring passport for SIM registration (required)',
          'Dialog has best coverage overall',
          'Data packages: 10GB for ~$5-10',
          'Top up at any mobile shop',
          'Save offline maps before rural travel',
          'WiFi calling works well for international calls',
          'Cafes often share WiFi password with purchase'
        ]
      }
    ]
  },

  // ============================================
  // PHOTOGRAPHY
  // ============================================
  {
    id: 'photography',
    name: 'Photography Guide',
    icon: '📷',
    description: 'Capture Sri Lanka\'s stunning landscapes, wildlife, and culture',
    printable: true,
    sections: [
      {
        id: 'photo-spots',
        title: 'Top Photography Locations',
        content: `Sri Lanka offers incredible photographic diversity - from misty tea plantations to golden beaches, ancient ruins to wildlife encounters. Timing is crucial for the best light. Here are the most photogenic spots and when to shoot them.`,
        highlights: [
          'Nine Arch Bridge, Ella - iconic railway architecture',
          'Sigiriya Rock - sunrise or sunset from Pidurangala',
          'Stilt Fishermen, Koggala - early morning',
          'Galle Fort walls - golden hour',
          'Nuwara Eliya tea plantations - misty mornings',
          'Temple of the Tooth, Kandy - evening puja',
          'Yala National Park - leopards in golden light',
          'Coconut Tree Hill, Mirissa - sunrise/sunset'
        ],
        tips: [
          'Golden hour: 6-7am, 5:30-6:30pm',
          'Monsoon skies create dramatic landscapes',
          'Bring rain protection for camera gear',
          'Drone rules: permits needed, restricted near airports/temples',
          'Tripod useful for temples (low light)',
          'Polarizing filter reduces water reflections',
          'Telephoto essential for wildlife (min 200mm)',
          'Respect when photographing people - always ask'
        ]
      },
      {
        id: 'wildlife-photography',
        title: 'Wildlife Photography Tips',
        content: `Sri Lanka is a wildlife photographer's paradise with diverse species and accessible parks. Leopards, elephants, and blue whales are the main targets, but birds, reptiles, and marine life offer equally exciting opportunities. Preparation and patience are key.`,
        highlights: [
          'Leopards - Yala, Wilpattu (morning/evening)',
          'Elephants - Udawalawe, Minneriya, Kaudulla',
          'Blue Whales - Mirissa, Trincomalee',
          'Endemic birds - Sinharaja, Horton Plains',
          'Sea turtles - Hikkaduwa, Rekawa',
          'Crocodiles - Yala, Bundala',
          'Macaques and Langurs - widespread',
          'Reef fish - Pigeon Island, Hikkaduwa'
        ],
        tips: [
          'Minimum 100-400mm lens for safari',
          'Bean bag more stable than monopod in jeep',
          'Sit on proper side of jeep (guide knows)',
          'Memory cards and batteries - bring backups',
          'Dust protection essential on safari',
          'Best light: first and last hours of safari',
          'Patience crucial - wait for behavior, not just presence',
          'Underwater housing or GoPro for marine life'
        ]
      }
    ]
  },

  // ============================================
  // ACTIVITIES & ADVENTURES
  // ============================================
  {
    id: 'activities',
    name: 'Activities & Adventures',
    icon: '🎯',
    description: 'Adventure awaits - from white water rafting to hot air balloons',
    printable: true,
    sections: [
      {
        id: 'water-sports',
        title: 'Water Sports',
        content: `Sri Lanka's coastline and rivers offer diverse water sports year-round. Surfing is the most popular, but diving, snorkeling, white water rafting, and kitesurfing attract adventure seekers. Water temperatures remain warm (26-29°C) throughout the year.`,
        highlights: [
          'Surfing - Arugam Bay, Weligama, Mirissa, Hikkaduwa',
          'Diving - Hikkaduwa, Trincomalee, Batticaloa wrecks',
          'Snorkeling - Pigeon Island, Hikkaduwa, Unawatuna',
          'White water rafting - Kitulgala (Grade 3-4)',
          'Kitesurfing - Kalpitiya (May-October)',
          'Stand-up paddleboarding - lagoons and calm beaches',
          'Jet skiing - Bentota, Negombo',
          'Whale/dolphin watching - boat trips from several ports'
        ],
        tips: [
          'Check seasonal conditions for each activity',
          'Use certified operators for safety',
          'Beginner lessons widely available and affordable',
          'Reef-safe sunscreen protects marine life',
          'Kitulgala rafting includes 4-5 rapids',
          'Dive certification courses available ($300-400)',
          'Bring own mask if you have prescription needs',
          'Water shoes useful for reef areas'
        ]
      },
      {
        id: 'trekking-hiking',
        title: 'Trekking & Hiking',
        content: `From challenging mountain peaks to gentle nature walks, Sri Lanka offers trails for all fitness levels. The central highlands provide the most dramatic scenery, while rainforest treks offer biodiversity encounters. Local guides enhance safety and wildlife spotting.`,
        highlights: [
          'Adam\'s Peak - sacred pilgrimage, sunrise climb',
          'Knuckles Range - challenging multi-day treks',
          'Ella Rock - 3-hour hike with panoramic views',
          'Little Adam\'s Peak - easy morning hike',
          'Horton Plains World\'s End - scenic plateau walk',
          'Sinharaja Rainforest - guided nature trails',
          'Pidurangala Rock - sunrise view of Sigiriya',
          'Namunukula - off-the-beaten-path mountain'
        ],
        tips: [
          'Start hikes at dawn for cooler temperatures',
          'Hire local guides for remote trails',
          'Leech socks essential for rainforest (especially wet season)',
          'Carry 2+ liters of water on longer hikes',
          'Rain jacket needed - afternoon showers common',
          'Proper hiking shoes for rocky terrain',
          'Download offline maps before setting out',
          'Tell hotel your hiking plans for safety'
        ]
      },
      {
        id: 'adventure-activities',
        title: 'Adventure Experiences',
        content: `Beyond traditional activities, Sri Lanka offers unique adventures for thrill-seekers. From hot air balloon rides over ancient ruins to canyoning in hidden waterfalls, there's plenty to get your adrenaline pumping.`,
        highlights: [
          'Hot air balloon - Sigiriya sunrise flights',
          'Canyoning - Kitulgala waterfalls',
          'Zip lining - Ella, Kandy areas',
          'Mountain biking - hill country trails',
          'Rock climbing - Sigiriya area bouldering',
          'Camping safaris - overnight in national parks',
          'Paragliding - Horton Plains (seasonal)',
          'Quad biking - Ella, Sigiriya'
        ],
        tips: [
          'Book balloon rides well in advance (limited capacity)',
          'Canyoning requires reasonable fitness',
          'Check operator safety records and insurance',
          'Best adventure weather: dry season for each region',
          'Wear appropriate clothing and footwear',
          'Photography challenges on moving activities',
          'Medical conditions may restrict some activities',
          'Early morning best for balloon and paragliding'
        ]
      }
    ]
  },

  // ============================================
  // SHOPPING
  // ============================================
  {
    id: 'shopping',
    name: 'Shopping Guide',
    icon: '🛍️',
    description: 'What to buy and where - from gems to spices to handicrafts',
    printable: true,
    sections: [
      {
        id: 'what-to-buy',
        title: 'What to Buy in Sri Lanka',
        content: `Sri Lanka produces unique goods worth taking home. From world-famous Ceylon tea and precious gems to handmade masks and batik textiles, shopping here supports local artisans and brings home authentic souvenirs.`,
        highlights: [
          'Ceylon Tea - buy from estates or quality shops',
          'Gems - sapphires, rubies, cat\'s eyes (certified only)',
          'Spices - cinnamon, cardamom, pepper',
          'Batik textiles - hand-dyed fabric art',
          'Wooden masks - traditional Ambalangoda craft',
          'Handloom fabrics - traditional weaving',
          'Ayurvedic products - oils, soaps, medicines',
          'Lacquerware - colorful traditional craft'
        ],
        tips: [
          'Buy tea from established brands or estates',
          'Gems only from government-certified dealers',
          'Get gem certificate for customs and insurance',
          'Bargain at markets, not fixed-price shops',
          'Batik factories offer best prices and quality',
          'Spices freshest from producer gardens',
          'Wooden items may need fumigation certificate',
          'Keep receipts for customs if asked'
        ]
      },
      {
        id: 'where-to-shop',
        title: 'Shopping Destinations',
        content: `From bustling markets to air-conditioned malls, Sri Lanka offers diverse shopping experiences. Each region has specialties, and visiting workshops provides insight into craftsmanship while ensuring authenticity.`,
        highlights: [
          'Colombo - malls, boutiques, Pettah Market',
          'Galle Fort - boutique shops, jewelry, art',
          'Kandy - batik, handicrafts, Kandy City Center',
          'Ratnapura - gem capital, certified dealers',
          'Ambalangoda - traditional mask workshops',
          'Nuwara Eliya - tea direct from estates',
          'Matale - spice gardens and shops',
          'Negombo - fish market, handicrafts'
        ],
        tips: [
          'Pettah Market: cheap but chaotic - watch belongings',
          'Galle Fort: quality but premium prices',
          'Odel and Barefoot in Colombo for quality souvenirs',
          'Lanka Hands shops support fair trade artisans',
          'Airport duty-free good for tea and gems',
          'Avoid tours to specific gem shops (commissions)',
          'Factory shops often cheaper than retailers',
          'Check baggage weight before shopping spree'
        ]
      }
    ]
  },

  // ============================================
  // FESTIVALS & EVENTS
  // ============================================
  {
    id: 'festivals',
    name: 'Festivals & Events',
    icon: '🎉',
    description: 'Experience Sri Lanka\'s vibrant celebrations throughout the year',
    printable: true,
    sections: [
      {
        id: 'major-festivals',
        title: 'Major Festivals',
        content: `Sri Lanka's calendar is filled with colorful festivals celebrating Buddhist, Hindu, Christian, and Muslim traditions. These events offer insight into the island's spiritual heritage and are spectacular photographic opportunities. Planning around festivals can enhance your trip significantly.`,
        highlights: [
          'Esala Perahera (July/Aug) - Kandy\'s spectacular procession',
          'Sinhala & Tamil New Year (April) - nationwide celebration',
          'Vesak (May) - Buddha\'s birth/enlightenment/death',
          'Thai Pongal (January) - Tamil harvest festival',
          'Navam Perahera (February) - Colombo\'s parade',
          'Diwali (Oct/Nov) - Hindu festival of lights',
          'Kataragama Festival (July/Aug) - multi-faith pilgrimage',
          'Christmas (December) - celebrated widely'
        ],
        tips: [
          'Kandy Esala Perahera: book hotels months ahead',
          'April New Year: many businesses closed for a week',
          'Full moon (Poya) days are public holidays monthly',
          'Festival dates change yearly - check current calendar',
          'Temple festivals often include elaborate processions',
          'Dress modestly when attending religious festivals',
          'Crowds can be intense - secure belongings',
          'Photography usually welcomed but ask at ceremonies'
        ]
      },
      {
        id: 'poya-days',
        title: 'Poya (Full Moon) Days',
        content: `Every full moon day (Poya) is a public holiday in Sri Lanka, commemorating significant events in Buddhist history. On these days, temples are especially active, shops may close, and alcohol sales are prohibited. Each Poya has specific significance and associated rituals.`,
        highlights: [
          'Monthly public holiday - plan accordingly',
          'Temples beautifully decorated and active',
          'Pilgrims dressed in white attend temples',
          'Alcohol sales prohibited nationwide',
          'Vesak Poya (May) - most significant',
          'Poson Poya (June) - arrival of Buddhism to Lanka',
          'Esala Poya (July) - Temple of Tooth festival',
          'Hotels exempt from alcohol restrictions'
        ],
        tips: [
          'Check Poya dates before planning activities',
          'Temples worth visiting on Poya days',
          'Some tourist sites may have reduced hours',
          'Stock up on any needed alcohol the day before',
          'Restaurants at hotels remain open',
          'Dress in white or light colors if visiting temples',
          'Evening illuminations beautiful on Vesak/Poson',
          'Public transport may be crowded with pilgrims'
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

// Get total section count
export const getTotalSections = (): number => {
  return travelGuideCategories.reduce((acc, cat) => acc + cat.sections.length, 0);
};

// Get category names for filter
export const getCategoryNames = (): string[] => {
  return travelGuideCategories.map(cat => cat.name);
};
