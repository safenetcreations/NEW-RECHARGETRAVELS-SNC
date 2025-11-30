
export interface WildToursTour {
    id: string;
    title: string;
    description: string;
    location: string;
    duration: string;
    price: number;
    image: string;
    rating: number;
    reviews: number;
    category: string;
    highlights: string[];
    difficulty: string;
    maxGroupSize: number;
    included: string[];
    altitude?: string;
    featured?: boolean;
    videoUrl?: string;
    gallery?: string[];
    bestSeason?: string;
    startLocation?: string;
    transportNote?: string;
    importantInfo?: string[];
}

export const defaultWildToursTours: WildToursTour[] = [
    {
        id: '1',
        title: "Yala Royal Leopard Safari",
        location: "Yala National Park",
        image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800",
        description: "Full-day private safari across Yala Blocks 1 & 2 with a leopard-tracking naturalist, gourmet field dining, and premium photographic support.",
        highlights: ["Leopard tracking radios", "Gourmet brunch", "Dedicated ranger", "Luxury Land Cruiser"],
        price: 520,
        rating: 4.95,
        reviews: 241,
        category: "wildlife-spotting",
        duration: "Full day",
        difficulty: "Easy",
        maxGroupSize: 6,
        included: ["Private jeep", "Naturalist", "All meals", "Permits"],
        altitude: "Sea level",
        featured: true,
        startLocation: "Yala National Park Gate / Tissamaharama",
        transportNote: "Tours depart from Tissamaharama or the Yala main gate. Transfers from Colombo, Galle, or other cities can be organized for an additional transport fee.",
        importantInfo: [
            "Passport/NIC required for park entry permits",
            "Leopard sightings are likely but never guaranteed",
            "Luxury jeeps stocked with cold towels, drinks, and field guides",
        ],
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder
        gallery: [
            "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800",
            "https://images.unsplash.com/photo-1549366021-9f761d040a94?w=800",
            "https://images.unsplash.com/photo-1518877593221-1f28583780b4?w=800"
        ],
        bestSeason: "February to July"
    },
    {
        id: '2',
        title: "Wilpattu Midnight Glamping & Night Drive",
        location: "Wilpattu National Park",
        image: "https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=800",
        description: "Luxury forest camp with Sri Lanka’s only licensed night drive to track sloth bears and leopards, plus chef-led dining under the stars.",
        highlights: ["Night safari permit", "Chef-led dining", "Sloth bear focus", "Stargazing deck"],
        price: 780,
        rating: 4.9,
        reviews: 112,
        category: "jeep-adventure",
        duration: "2 days",
        difficulty: "Moderate",
        maxGroupSize: 8,
        included: ["Luxury tent", "Night/day drives", "Meals", "Transfers"],
        altitude: "0-50m",
        featured: true,
        startLocation: "Wilpattu Sanctuary Entrance / Puttalam",
        transportNote: "Complimentary pickup from Puttalam and Anuradhapura. Colombo pickups incur an additional chauffeured transfer fee.",
        importantInfo: [
            "Night drives subject to weather and park regulations",
            "Child policy: minimum age 10 for night activities",
            "Glamping tents include en-suite bathrooms and air-cooling units",
        ],
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder
        gallery: [
            "https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=800",
            "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800",
            "https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=800"
        ],
        bestSeason: "May to September"
    },
    {
        id: '3',
        title: "Minneriya Elephant Gathering",
        location: "Minneriya National Park",
        image: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800",
        description: "Golden-hour elephant safari hosted by a professional wildlife photographer to capture the annual Great Gathering.",
        highlights: ["300+ elephants", "Photographer host", "Sunset picnic", "Hydrophone elephant calls"],
        price: 260,
        rating: 4.85,
        reviews: 198,
        category: "wildlife-spotting",
        duration: "5 hours",
        difficulty: "Easy",
        maxGroupSize: 10,
        included: ["Private jeep", "Photographer", "Refreshments", "Park fees"],
        altitude: "90m",
        featured: true,
        startLocation: "Minneriya / Habarana Junction",
        transportNote: "Complimentary pickup within Habarana & Sigiriya triangle. Outstation transfers available at cost.",
        importantInfo: [
            "Best season July–September for the largest herds",
            "Bring a telephoto lens for close-up shots",
            "Hydration packs and binoculars provided on board",
        ],
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder
        gallery: [
            "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800",
            "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800",
            "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800"
        ],
        bestSeason: "July to September"
    },
    {
        id: '4',
        title: "Sinharaja Rainforest Expedition",
        location: "Sinharaja Biosphere Reserve",
        image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800",
        description: "Field-biologist-led trek targeting Sri Lanka’s endemic birdlife, reptiles, and purple-faced langurs with canopy lunch deck.",
        highlights: ["Endemic bird checklist", "Canopy lunch", "Field biologist", "Private transfers"],
        price: 310,
        rating: 4.8,
        reviews: 143,
        category: "jungle-trek",
        duration: "Full day",
        difficulty: "Moderate",
        maxGroupSize: 8,
        included: ["Guide", "Lunch", "Rain gear", "Transport"],
        altitude: "300-1170m",
        startLocation: "Deniyaya / Kudawa Research Station",
        transportNote: "We depart from Deniyaya or Kudawa entrances. If you require pickup from Colombo, Galle, or Matara, chauffeured transfers can be arranged.",
        importantInfo: [
            "Expect leeches and humidity—protective gear provided",
            "Trails involve uneven, wet terrain",
            "Lunch is served on a canopy deck overlooking the rainforest",
        ],
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder
        gallery: [
            "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800",
            "https://images.unsplash.com/photo-1444927714506-8492d94b5ba0?w=800",
            "https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=800"
        ],
        bestSeason: "December to April"
    },
    {
        id: '5',
        title: "Udawalawe Family Elephant Safari",
        location: "Udawalawe National Park",
        image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800",
        description: "Gentle-paced safari curated for families with wildlife educator, junior ranger kits, and AC safari jeep.",
        highlights: ["Kid-friendly briefings", "Junior ranger kits", "Transit home visit", "AC safari jeep"],
        price: 240,
        rating: 4.7,
        reviews: 176,
        category: "family-safari",
        duration: "Half day",
        difficulty: "Easy",
        maxGroupSize: 12,
        included: ["Private jeep", "Educator", "Snacks", "Transit home entry"],
        altitude: "130m",
        startLocation: "Udawalawe National Park Entrance",
        transportNote: "Complimentary pickup from Udawalawe hotels. Transfers from southern beaches available on request with surcharge.",
        importantInfo: [
            "Junior ranger activity packs tailored for ages 5–12",
            "Includes visit to Elephant Transit Home feeding session",
            "Air-conditioned jeeps available on request",
        ],
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder
        gallery: [
            "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800",
            "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800",
            "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800"
        ],
        bestSeason: "Year-round"
    },
    {
        id: '6',
        title: "Kumana Birding Lagoon Cruise",
        location: "Kumana National Park",
        image: "https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=800",
        description: "Silent electric-boat safari along Kumbukkan Oya spotting migratory birds, crocodiles, and fishing cats with night hide access.",
        highlights: ["Electric boat", "Spotting scopes", "Coffee sundowner", "Fishing cat hide"],
        price: 390,
        rating: 4.88,
        reviews: 89,
        category: "birding",
        duration: "Afternoon & evening",
        difficulty: "Easy",
        maxGroupSize: 6,
        included: ["Boat charter", "Naturalist", "Refreshments", "Night hide access"],
        altitude: "Sea level",
        featured: true,
        startLocation: "Arugam Bay Lagoon Jetty",
        transportNote: "Guests staying outside Arugam Bay can request private transfers at an additional charge.",
        importantInfo: [
            "Silent boat minimizes disturbance to birdlife",
            "Night hide experience focused on fishing cats & porcupines",
            "Coffee & artisan snacks served onboard",
        ],
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder
        gallery: [
            "https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=800",
            "https://images.unsplash.com/photo-1444927714506-8492d94b5ba0?w=800",
            "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800"
        ],
        bestSeason: "April to September"
    },
];
