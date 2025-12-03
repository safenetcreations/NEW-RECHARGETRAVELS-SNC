"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedExperienceContent = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const db = admin.firestore();
// Experience content data
const EXPERIENCE_CONTENT = {
    whaleWatchingPageContent: {
        hero: {
            title: 'Whale Watching Concierge Booking',
            subtitle: 'Licensed sunrise departures in Mirissa & Trincomalee with marine biologist hosts.',
            badge: 'World Cetacean Alliance aligned',
            backgroundImage: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?auto=format&fit=crop&w=2000&q=80',
            images: [
                { id: '1', url: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a', caption: 'Blue Whale in Sri Lankan Waters' },
                { id: '2', url: 'https://images.unsplash.com/photo-1511259474226-3c0a03c2b1a8', caption: 'Whale Tail Breaching' },
                { id: '3', url: 'https://images.unsplash.com/photo-1568430462989-44163eb1752f', caption: 'Dolphins Swimming' },
                { id: '4', url: 'https://images.unsplash.com/photo-1454372182658-c712e4c5a1db', caption: 'Whale Watching Boat Tour' }
            ]
        },
        seasons: [
            {
                id: 'mirissa',
                title: 'Mirissa Season',
                months: 'November - April',
                description: 'Southern coast season with calm seas and excellent blue whale sightings',
                successStat: '98% sighting success rate',
                pickupPoint: 'Mirissa Harbor',
                departure: '6:00 AM',
                highlights: ['Blue Whales', 'Spinner Dolphins', 'Sperm Whales', 'Sea Turtles']
            },
            {
                id: 'trincomalee',
                title: 'Trincomalee Season',
                months: 'May - October',
                description: 'East coast season with deeper waters and diverse marine life',
                successStat: '95% sighting success rate',
                pickupPoint: 'Trincomalee Harbor',
                departure: '6:30 AM',
                highlights: ['Blue Whales', 'Orcas', 'Pilot Whales', 'Dolphins']
            }
        ],
        tours: [
            {
                id: 'premium-mirissa',
                name: 'Premium Mirissa Whale Watch',
                duration: '4-5 hours',
                price: 125,
                priceLabel: 'USD 125 per person',
                description: 'Exclusive small group whale watching experience with marine biologist guide',
                maxGuests: 12,
                rating: 4.9,
                includes: ['Hotel pickup', 'Light breakfast', 'Marine biologist guide', 'Whale spotting guarantee'],
                image: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=800'
            },
            {
                id: 'standard-mirissa',
                name: 'Standard Mirissa Tour',
                duration: '4 hours',
                price: 65,
                priceLabel: 'USD 65 per person',
                description: 'Group whale watching experience with experienced captain',
                maxGuests: 24,
                rating: 4.7,
                includes: ['Boat ride', 'Life jacket', 'Refreshments'],
                image: 'https://images.unsplash.com/photo-1511259474226-3c0a03c2b1a8?w=800'
            }
        ],
        overview: {
            summary: 'Experience the thrill of encountering the world\'s largest mammals in the pristine waters of Sri Lanka.',
            badges: ['Eco-Certified', 'Small Groups', 'Expert Guides'],
            highlights: ['98% Success Rate', 'Marine Biologist Hosts', 'Sustainable Tourism']
        },
        pricing: {
            currency: 'USD',
            adultPrice: 65,
            childPrice: 45,
            depositNote: '20% deposit required at booking',
            disclaimer: 'Prices may vary by season',
            lowestPriceGuarantee: 'Best price guaranteed',
            refundPolicy: 'Full refund if cancelled 48 hours before'
        }
    },
    teaTrailsContent: {
        hero: {
            title: 'Ceylon Tea Trails Experience',
            subtitle: 'Journey through emerald estates in the heart of Sri Lanka\'s hill country',
            badge: 'Heritage Certified',
            backgroundImage: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=2000&q=80',
            images: [
                { id: '1', url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574', caption: 'Lush Tea Plantations' },
                { id: '2', url: 'https://images.unsplash.com/photo-1582639510494-c80b5de9f148', caption: 'Tea Plucking Experience' },
                { id: '3', url: 'https://images.unsplash.com/photo-1523920290228-4f321a939b4c', caption: 'Colonial Tea Factory' }
            ]
        },
        estates: [
            {
                id: 'castlereagh',
                name: 'Castlereagh Estate',
                location: 'Hatton',
                elevation: '1,250m',
                description: 'Historic estate overlooking Castlereagh Reservoir',
                highlights: ['Lake Views', 'Heritage Bungalow', 'High-grown Tea'],
                image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800'
            },
            {
                id: 'norwood',
                name: 'Norwood Estate',
                location: 'Nuwara Eliya',
                elevation: '1,800m',
                description: 'Premium high-altitude tea estate',
                highlights: ['Misty Mountains', 'Best Ceylon Tea', 'Tea Tasting'],
                image: 'https://images.unsplash.com/photo-1582639510494-c80b5de9f148?w=800'
            }
        ],
        tours: [
            {
                id: 'full-day-tea',
                name: 'Full Day Tea Trail',
                duration: '8 hours',
                price: 120,
                description: 'Complete tea experience from plantation to cup',
                includes: ['Estate visit', 'Factory tour', 'Tea plucking', 'Lunch', 'Tea tasting']
            },
            {
                id: 'half-day-tea',
                name: 'Half Day Tea Experience',
                duration: '4 hours',
                price: 65,
                description: 'Quick immersion into Ceylon tea culture',
                includes: ['Factory tour', 'Tea tasting', 'Gift pack']
            }
        ],
        pricing: {
            currency: 'USD',
            basePrice: 65,
            groupDiscount: '10% off for groups of 4+'
        }
    },
    ayurvedaContent: {
        hero: {
            title: 'Authentic Ayurveda Wellness',
            subtitle: 'Ancient healing traditions in certified wellness centers',
            badge: 'Government Certified',
            backgroundImage: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=2000&q=80',
            images: [
                { id: '1', url: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597', caption: 'Ayurvedic Spa Treatment' },
                { id: '2', url: 'https://images.unsplash.com/photo-1540555700478-4be289fbec6d', caption: 'Herbal Garden' },
                { id: '3', url: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1', caption: 'Meditation Session' }
            ]
        },
        treatments: [
            {
                id: 'panchakarma',
                name: 'Panchakarma Detox',
                duration: '7-21 days',
                description: 'Complete body purification and rejuvenation program',
                benefits: ['Detoxification', 'Weight Management', 'Stress Relief', 'Immune Boost'],
                price: 'From $1,500'
            },
            {
                id: 'rejuvenation',
                name: 'Rejuvenation Package',
                duration: '3-7 days',
                description: 'Revitalize mind and body with traditional therapies',
                benefits: ['Anti-aging', 'Energy Boost', 'Better Sleep', 'Mental Clarity'],
                price: 'From $500'
            },
            {
                id: 'stress-relief',
                name: 'Stress Relief Program',
                duration: '5-14 days',
                description: 'Specialized treatment for stress and anxiety',
                benefits: ['Relaxation', 'Mental Peace', 'Better Focus', 'Emotional Balance'],
                price: 'From $800'
            }
        ],
        centers: [
            {
                id: 'siddhalepa',
                name: 'Siddhalepa Ayurveda Resort',
                location: 'Wadduwa',
                rating: 4.9,
                description: 'World-renowned ayurveda hospital and resort'
            },
            {
                id: 'barberyn',
                name: 'Barberyn Beach Ayurveda',
                location: 'Weligama',
                rating: 4.8,
                description: 'Beachside wellness retreat'
            }
        ]
    },
    pilgrimageContent: {
        hero: {
            title: 'Sacred Pilgrimage Tours',
            subtitle: 'Journey to Sri Lanka\'s most revered spiritual sites',
            badge: 'Spiritual Heritage',
            backgroundImage: 'https://images.unsplash.com/photo-1580181046391-e7e83f206c62?auto=format&fit=crop&w=2000&q=80',
            images: [
                { id: '1', url: 'https://images.unsplash.com/photo-1580181046391-e7e83f206c62', caption: 'Temple of the Tooth' },
                { id: '2', url: 'https://images.unsplash.com/photo-1588598198321-39f8c2be97ba', caption: 'Anuradhapura Stupas' },
                { id: '3', url: 'https://images.unsplash.com/photo-1586523969943-2d62a1a7d4d3', caption: 'Adam\'s Peak Sunrise' }
            ]
        },
        tours: [
            {
                id: 'cultural-triangle',
                name: 'Cultural Triangle Pilgrimage',
                duration: '5 days',
                price: 650,
                sites: ['Anuradhapura', 'Polonnaruwa', 'Dambulla', 'Kandy'],
                description: 'Visit the sacred cities of the Cultural Triangle',
                includes: ['Accommodation', 'Guide', 'Transport', 'Temple offerings']
            },
            {
                id: 'adams-peak',
                name: 'Adam\'s Peak Pilgrimage',
                duration: '2 days',
                price: 180,
                sites: ['Sri Pada (Adam\'s Peak)'],
                description: 'Sacred mountain climb with sunrise viewing',
                includes: ['Transport', 'Guide', 'Accommodation', 'Meals']
            },
            {
                id: 'ramayana-trail',
                name: 'Ramayana Trail',
                duration: '7 days',
                price: 850,
                sites: ['Munneswaram', 'Sita Amman', 'Ravana Falls', 'Nuwara Eliya'],
                description: 'Follow the legendary Ramayana trail across Sri Lanka',
                includes: ['All accommodation', 'Expert guide', 'Transport', 'Meals']
            }
        ],
        sacredSites: [
            { id: 'kandy', name: 'Temple of the Tooth', religion: 'Buddhist', location: 'Kandy' },
            { id: 'anuradhapura', name: 'Sri Maha Bodhi', religion: 'Buddhist', location: 'Anuradhapura' },
            { id: 'kataragama', name: 'Kataragama Temple', religion: 'Multi-faith', location: 'Kataragama' },
            { id: 'nagadeepa', name: 'Nagadeepa Purana Viharaya', religion: 'Buddhist', location: 'Jaffna' }
        ]
    },
    cookingClassContent: {
        hero: {
            title: 'Sri Lankan Cooking Classes',
            subtitle: 'Master authentic Ceylon cuisine with expert chefs',
            badge: 'Culinary Experience',
            backgroundImage: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=2000&q=80',
            images: [
                { id: '1', url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d', caption: 'Traditional Cooking' },
                { id: '2', url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe', caption: 'Spice Market Tour' },
                { id: '3', url: 'https://images.unsplash.com/photo-1544025162-d76694265947', caption: 'Enjoy Your Creation' }
            ]
        },
        classes: [
            {
                id: 'traditional-rice-curry',
                name: 'Traditional Rice & Curry',
                duration: '4 hours',
                price: 45,
                dishes: ['Coconut Rice', 'Chicken Curry', 'Dhal', 'Pol Sambol', 'Papadam'],
                includes: ['Market visit', 'All ingredients', 'Recipe book', 'Lunch']
            },
            {
                id: 'seafood-special',
                name: 'Coastal Seafood Special',
                duration: '5 hours',
                price: 65,
                dishes: ['Fish Ambul Thiyal', 'Prawn Curry', 'Crab Curry', 'Coconut Roti'],
                includes: ['Fish market tour', 'All ingredients', 'Recipe book', 'Lunch']
            },
            {
                id: 'street-food',
                name: 'Sri Lankan Street Food',
                duration: '3 hours',
                price: 35,
                dishes: ['Kottu Roti', 'Hoppers', 'String Hoppers', 'Samosas'],
                includes: ['All ingredients', 'Recipe book', 'Tasting session']
            }
        ],
        locations: [
            { id: 'colombo', name: 'Colombo Cooking Studio', address: 'Colombo 07' },
            { id: 'galle', name: 'Galle Fort Kitchen', address: 'Galle Fort' },
            { id: 'kandy', name: 'Hill Country Kitchen', address: 'Kandy' }
        ]
    },
    waterfallsContent: {
        hero: {
            title: 'Spectacular Sri Lankan Waterfalls',
            subtitle: 'Discover cascading wonders in the hill country',
            badge: 'Natural Heritage',
            backgroundImage: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=2000&q=80',
            images: [
                { id: '1', url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9', caption: 'Bambarakanda Falls' },
                { id: '2', url: 'https://images.unsplash.com/photo-1546587348-d12660c30c50', caption: 'Diyaluma Falls' },
                { id: '3', url: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb', caption: 'Ravana Falls' }
            ]
        },
        waterfalls: [
            {
                id: 'bambarakanda',
                name: 'Bambarakanda Falls',
                height: '263m',
                rank: 'Tallest in Sri Lanka',
                location: 'Kalupahana, Badulla',
                description: 'Sri Lanka\'s tallest waterfall cascading majestically',
                difficulty: 'Moderate',
                duration: '2-3 hours',
                bestTime: 'January - April'
            },
            {
                id: 'diyaluma',
                name: 'Diyaluma Falls',
                height: '220m',
                rank: '2nd Highest',
                location: 'Koslanda',
                description: 'Features stunning natural infinity pools',
                difficulty: 'Moderate to Hard',
                duration: '3-4 hours',
                bestTime: 'Year-round'
            },
            {
                id: 'ravana',
                name: 'Ravana Falls',
                height: '25m',
                rank: 'Most Accessible',
                location: 'Ella',
                description: 'Associated with the Ramayana legend',
                difficulty: 'Easy',
                duration: '1-2 hours',
                bestTime: 'Year-round'
            }
        ],
        tours: [
            {
                id: 'waterfall-circuit',
                name: 'Waterfall Circuit Tour',
                duration: 'Full Day',
                price: 85,
                description: 'Visit 3 major waterfalls in one day',
                includes: ['Transport', 'Guide', 'Lunch', 'Entrance fees']
            }
        ]
    },
    lagoonSafariContent: {
        hero: {
            title: 'Lagoon Safari Adventures',
            subtitle: 'Explore pristine lagoons and mangrove ecosystems',
            badge: 'Eco-Tourism',
            backgroundImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=2000&q=80',
            images: [
                { id: '1', url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5', caption: 'Lagoon Waters' },
                { id: '2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d', caption: 'Mangrove Forest' }
            ]
        },
        lagoons: [
            {
                id: 'negombo',
                name: 'Negombo Lagoon',
                location: 'Negombo',
                description: 'Rich biodiversity and fishing communities',
                highlights: ['Bird Watching', 'Fishing Villages', 'Mangroves']
            },
            {
                id: 'koggala',
                name: 'Koggala Lagoon',
                location: 'Koggala',
                description: 'Scenic lagoon with cinnamon islands',
                highlights: ['Cinnamon Islands', 'Temple Island', 'Bird Sanctuary']
            },
            {
                id: 'batticaloa',
                name: 'Batticaloa Lagoon',
                location: 'Batticaloa',
                description: 'Famous singing fish phenomenon',
                highlights: ['Singing Fish', 'Sunset Tours', 'Local Culture']
            }
        ],
        tours: [
            {
                id: 'sunrise-safari',
                name: 'Sunrise Lagoon Safari',
                duration: '3 hours',
                price: 45,
                includes: ['Boat ride', 'Bird watching', 'Breakfast', 'Guide']
            },
            {
                id: 'sunset-cruise',
                name: 'Sunset Lagoon Cruise',
                duration: '2 hours',
                price: 35,
                includes: ['Boat ride', 'Refreshments', 'Photography stops']
            }
        ]
    },
    islandGetawaysContent: {
        hero: {
            title: 'Sri Lankan Island Escapes',
            subtitle: 'Discover hidden paradise islands off the coast',
            badge: 'Island Paradise',
            backgroundImage: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?auto=format&fit=crop&w=2000&q=80',
            images: [
                { id: '1', url: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5', caption: 'Pigeon Island' },
                { id: '2', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', caption: 'Delft Island' }
            ]
        },
        islands: [
            {
                id: 'pigeon',
                name: 'Pigeon Island',
                location: 'Trincomalee',
                description: 'National park with pristine coral reefs',
                activities: ['Snorkeling', 'Diving', 'Beach', 'Wildlife'],
                bestTime: 'May - October'
            },
            {
                id: 'delft',
                name: 'Delft Island',
                location: 'Jaffna',
                description: 'Wild horses and Dutch colonial ruins',
                activities: ['History', 'Wild Horses', 'Ancient Ruins', 'Culture'],
                bestTime: 'Year-round'
            },
            {
                id: 'taprobane',
                name: 'Taprobane Island',
                location: 'Weligama',
                description: 'Private island with luxury villa',
                activities: ['Luxury Stay', 'Privacy', 'Beach', 'Relaxation'],
                bestTime: 'November - April'
            }
        ],
        tours: [
            {
                id: 'pigeon-day-trip',
                name: 'Pigeon Island Day Trip',
                duration: 'Full Day',
                price: 75,
                includes: ['Boat transfer', 'Snorkeling gear', 'Lunch', 'Guide']
            },
            {
                id: 'delft-expedition',
                name: 'Delft Island Expedition',
                duration: 'Full Day',
                price: 65,
                includes: ['Ferry tickets', 'Guide', 'Lunch', 'Island tour']
            }
        ]
    },
    trainJourneysContent: {
        hero: {
            title: 'Scenic Train Journeys',
            subtitle: 'Experience the world\'s most beautiful train rides',
            badge: 'Heritage Railway',
            backgroundImage: 'https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?auto=format&fit=crop&w=2000&q=80',
            images: [
                { id: '1', url: 'https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9', caption: 'Nine Arch Bridge' },
                { id: '2', url: 'https://images.unsplash.com/photo-1540202403-b7abd6747a18', caption: 'Tea Country Views' }
            ]
        },
        routes: [
            {
                id: 'ella-kandy',
                name: 'Kandy to Ella',
                duration: '6-7 hours',
                distance: '140 km',
                highlights: ['Nine Arch Bridge', 'Tea Plantations', 'Waterfalls', 'Mountains'],
                bestClass: 'First Class Observation',
                price: { firstClass: 15, secondClass: 8, thirdClass: 3 }
            },
            {
                id: 'colombo-kandy',
                name: 'Colombo to Kandy',
                duration: '2.5-3 hours',
                distance: '116 km',
                highlights: ['Coconut Plantations', 'Rice Paddies', 'Hill Views'],
                bestClass: 'First Class',
                price: { firstClass: 8, secondClass: 4, thirdClass: 2 }
            },
            {
                id: 'coastal',
                name: 'Colombo to Galle',
                duration: '2.5 hours',
                distance: '120 km',
                highlights: ['Ocean Views', 'Beaches', 'Fishing Villages'],
                bestClass: 'Second Class',
                price: { firstClass: 6, secondClass: 3, thirdClass: 1.5 }
            }
        ],
        tips: [
            'Book first class seats in advance',
            'Sit on the right side for best views (Kandy to Ella)',
            'Bring snacks and water',
            'Keep valuables secure'
        ]
    }
};
// Luxury Pages Content Data
const LUXURY_PAGES_CONTENT = {
    'helicopter-charters': {
        heroTitle: 'Private Helicopter Charters',
        heroSubtitle: 'Experience Sri Lanka from the skies in ultimate luxury',
        heroImages: [
            { url: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=2000&q=80', title: 'Luxury Helicopter', subtitle: 'VIP Charter Service' },
            { url: 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?auto=format&fit=crop&w=2000&q=80', title: 'Aerial Views', subtitle: 'Stunning Landscapes' }
        ],
        seoTitle: 'Private Helicopter Charters Sri Lanka | VIP Aerial Tours',
        seoDescription: 'Charter luxury helicopters for aerial tours, transfers, and exclusive experiences across Sri Lanka. VIP service with experienced pilots.',
        contactPhone: '+94 777 721 999',
        contactEmail: 'luxury@rechargetravels.com'
    },
    'private-yachts': {
        heroTitle: 'Private Yacht Charters',
        heroSubtitle: 'Sail the pristine waters of the Indian Ocean in style',
        heroImages: [
            { url: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=2000&q=80', title: 'Luxury Yacht', subtitle: 'Ocean Adventures' },
            { url: 'https://images.unsplash.com/photo-1540946485063-a40da27545f8?auto=format&fit=crop&w=2000&q=80', title: 'Sunset Cruise', subtitle: 'Unforgettable Moments' }
        ],
        seoTitle: 'Private Yacht Charters Sri Lanka | Luxury Ocean Experiences',
        seoDescription: 'Charter luxury yachts for sunset cruises, whale watching, and island hopping around Sri Lanka. Crewed and bareboat options available.',
        contactPhone: '+94 777 721 999',
        contactEmail: 'luxury@rechargetravels.com'
    },
    'private-jets': {
        heroTitle: 'Private Jet Services',
        heroSubtitle: 'Travel in ultimate comfort and style',
        heroImages: [
            { url: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=2000&q=80', title: 'Private Aviation', subtitle: 'First Class Travel' }
        ],
        seoTitle: 'Private Jet Charters Sri Lanka | Executive Aviation',
        seoDescription: 'Private jet charters and executive aviation services for discerning travelers visiting Sri Lanka.',
        contactPhone: '+94 777 721 999',
        contactEmail: 'luxury@rechargetravels.com'
    },
    'luxury-vehicles': {
        heroTitle: 'Luxury Vehicle Fleet',
        heroSubtitle: 'Travel in comfort with our premium chauffeur service',
        heroImages: [
            { url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=2000&q=80', title: 'Premium Fleet', subtitle: 'Chauffeur Service' },
            { url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2000&q=80', title: 'Executive Cars', subtitle: 'Travel in Style' }
        ],
        seoTitle: 'Luxury Car Hire Sri Lanka | Premium Chauffeur Service',
        seoDescription: 'Hire luxury vehicles with professional chauffeurs in Sri Lanka. Mercedes, BMW, Rolls Royce and more.',
        contactPhone: '+94 777 721 999',
        contactEmail: 'luxury@rechargetravels.com'
    },
    'exclusive-villas': {
        heroTitle: 'Exclusive Private Villas',
        heroSubtitle: 'Handpicked luxury villas for the ultimate Sri Lankan escape',
        heroImages: [
            { url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2000&q=80', title: 'Beachfront Villa', subtitle: 'Private Paradise' },
            { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80', title: 'Hillside Retreat', subtitle: 'Secluded Luxury' }
        ],
        seoTitle: 'Luxury Villas Sri Lanka | Private Villa Rentals',
        seoDescription: 'Book exclusive private villas in Sri Lanka. Beachfront, hillside and heritage properties with full staff.',
        contactPhone: '+94 777 721 999',
        contactEmail: 'luxury@rechargetravels.com'
    },
    'dream-journeys': {
        heroTitle: 'Dream Journeys',
        heroSubtitle: 'Bespoke travel experiences crafted for the discerning explorer',
        heroImages: [
            { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=80', title: 'Signature Journeys', subtitle: 'Beyond Ordinary' }
        ],
        seoTitle: 'Dream Journeys Sri Lanka | Bespoke Luxury Travel',
        seoDescription: 'Craft your perfect Sri Lankan journey with our dream journey planning service. Fully customizable luxury experiences.',
        contactPhone: '+94 777 721 999',
        contactEmail: 'luxury@rechargetravels.com'
    },
    'vip-concierge': {
        heroTitle: 'VIP Concierge Services',
        heroSubtitle: 'Your personal travel concierge for Sri Lanka',
        heroImages: [
            { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=80', title: 'VIP Service', subtitle: '24/7 Support' }
        ],
        seoTitle: 'VIP Concierge Sri Lanka | Personal Travel Assistant',
        seoDescription: '24/7 VIP concierge services for discerning travelers. Restaurant reservations, exclusive access, and personal assistance.',
        contactPhone: '+94 777 721 999',
        contactEmail: 'luxury@rechargetravels.com'
    },
    'exclusive-access': {
        heroTitle: 'Exclusive Access Experiences',
        heroSubtitle: 'Behind-the-scenes and private experiences unavailable elsewhere',
        heroImages: [
            { url: 'https://images.unsplash.com/photo-1580181046391-e7e83f206c62?auto=format&fit=crop&w=2000&q=80', title: 'Private Access', subtitle: 'Unique Experiences' }
        ],
        seoTitle: 'Exclusive Access Sri Lanka | Private VIP Experiences',
        seoDescription: 'Gain exclusive access to private temples, after-hours museum tours, and VIP experiences across Sri Lanka.',
        contactPhone: '+94 777 721 999',
        contactEmail: 'luxury@rechargetravels.com'
    },
    'luxury-hotels': {
        heroTitle: 'Luxury Hotels',
        heroSubtitle: 'The finest 5-star accommodations in Sri Lanka',
        heroImages: [
            { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=80', title: '5-Star Hotels', subtitle: 'World Class Service' }
        ],
        seoTitle: 'Luxury Hotels Sri Lanka | 5-Star Accommodation',
        seoDescription: 'Book the best luxury hotels in Sri Lanka. Exclusive rates and VIP amenities at top 5-star properties.',
        contactPhone: '+94 777 721 999',
        contactEmail: 'luxury@rechargetravels.com'
    },
    'luxury-apartments': {
        heroTitle: 'Luxury Apartments',
        heroSubtitle: 'Premium serviced apartments for extended stays',
        heroImages: [
            { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=2000&q=80', title: 'Premium Apartments', subtitle: 'Home Away from Home' }
        ],
        seoTitle: 'Luxury Apartments Sri Lanka | Serviced Accommodation',
        seoDescription: 'Book luxury serviced apartments in Colombo and across Sri Lanka. Perfect for extended stays.',
        contactPhone: '+94 777 721 999',
        contactEmail: 'luxury@rechargetravels.com'
    },
    'luxury-houses': {
        heroTitle: 'Luxury Houses',
        heroSubtitle: 'Exclusive private houses for family getaways',
        heroImages: [
            { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80', title: 'Private Houses', subtitle: 'Family Retreats' }
        ],
        seoTitle: 'Luxury Houses Sri Lanka | Private Holiday Homes',
        seoDescription: 'Rent exclusive private houses in Sri Lanka. Perfect for families and groups seeking privacy.',
        contactPhone: '+94 777 721 999',
        contactEmail: 'luxury@rechargetravels.com'
    }
};
// Luxury Fleet/Items Seed Data
const LUXURY_FLEET_DATA = {
    helicopterFleet: [
        {
            name: 'Airbus H145',
            image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=800&q=80',
            description: 'Twin-engine helicopter perfect for VIP transfers and scenic tours',
            features: ['Twin Engine', 'Air Conditioned', 'Leather Interior', 'VIP Configuration'],
            pricePerHour: 'USD 3,500',
            passengers: 8,
            isActive: true,
            sortOrder: 1
        },
        {
            name: 'Bell 407GXi',
            image: 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?auto=format&fit=crop&w=800&q=80',
            description: 'Single-engine helicopter ideal for city transfers and short tours',
            features: ['Single Engine', 'Air Conditioned', 'Executive Seating', 'Panoramic Windows'],
            pricePerHour: 'USD 2,200',
            passengers: 6,
            isActive: true,
            sortOrder: 2
        }
    ],
    yachtFleet: [
        {
            name: 'Sunseeker 75',
            image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=800&q=80',
            description: 'Luxury motor yacht for day cruises and overnight charters',
            features: ['4 Cabins', 'Full Crew', 'Water Toys', 'Gourmet Kitchen'],
            pricePerDay: 'USD 8,000',
            passengers: 10,
            isActive: true,
            sortOrder: 1
        },
        {
            name: 'Azimut 55',
            image: 'https://images.unsplash.com/photo-1540946485063-a40da27545f8?auto=format&fit=crop&w=800&q=80',
            description: 'Italian-designed yacht perfect for sunset cruises',
            features: ['3 Cabins', 'Flybridge', 'Jacuzzi', 'Entertainment System'],
            pricePerDay: 'USD 5,500',
            passengers: 8,
            isActive: true,
            sortOrder: 2
        }
    ],
    jetFleet: [
        {
            name: 'Citation XLS+',
            image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=800&q=80',
            description: 'Mid-size business jet for regional travel',
            features: ['Stand-up Cabin', 'WiFi', 'Refreshment Center', 'Lavatory'],
            pricePerHour: 'USD 4,500',
            passengers: 9,
            isActive: true,
            sortOrder: 1
        }
    ],
    vehicleFleet: [
        {
            name: 'Mercedes S-Class',
            image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
            description: 'Flagship luxury sedan for executive transfers',
            features: ['Massage Seats', 'Rear Entertainment', 'Privacy Glass', 'WiFi'],
            pricePerDay: 'USD 450',
            passengers: 4,
            isActive: true,
            sortOrder: 1
        },
        {
            name: 'Range Rover Autobiography',
            image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
            description: 'Premium SUV for countryside exploration',
            features: ['Panoramic Roof', 'Air Suspension', 'Meridian Sound', '4x4'],
            pricePerDay: 'USD 500',
            passengers: 4,
            isActive: true,
            sortOrder: 2
        },
        {
            name: 'BMW 7 Series',
            image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
            description: 'Executive sedan with advanced technology',
            features: ['Executive Lounge', 'Rear Recliners', 'Theater Screen', 'Mini Bar'],
            pricePerDay: 'USD 400',
            passengers: 4,
            isActive: true,
            sortOrder: 3
        }
    ],
    villaCollection: [
        {
            name: 'Ocean Pearl Villa',
            image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
            description: 'Beachfront villa with infinity pool in Mirissa',
            features: ['5 Bedrooms', 'Private Beach', 'Infinity Pool', 'Full Staff'],
            pricePerDay: 'USD 2,500',
            passengers: 10,
            isActive: true,
            sortOrder: 1
        },
        {
            name: 'Tea Estate Retreat',
            image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
            description: 'Colonial-era bungalow in Nuwara Eliya tea country',
            features: ['4 Bedrooms', 'Heritage Building', 'Tea Garden', 'Butler Service'],
            pricePerDay: 'USD 1,800',
            passengers: 8,
            isActive: true,
            sortOrder: 2
        }
    ],
    dreamJourneys: [
        {
            name: '14-Day Ultimate Sri Lanka',
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
            description: 'The complete luxury Sri Lanka experience covering all highlights',
            features: ['Private Guide', 'Luxury Hotels', 'Helicopter Transfer', 'Fine Dining'],
            pricePerDay: 'From USD 25,000',
            passengers: 2,
            isActive: true,
            sortOrder: 1
        },
        {
            name: '7-Day Wellness Journey',
            image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
            description: 'Ayurveda and wellness focused luxury retreat',
            features: ['Ayurveda Treatments', 'Yoga Sessions', 'Spa Resort', 'Organic Cuisine'],
            pricePerDay: 'From USD 12,000',
            passengers: 2,
            isActive: true,
            sortOrder: 2
        }
    ],
    vipConciergeServices: [
        {
            name: '24/7 Personal Concierge',
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
            description: 'Dedicated concierge for your entire stay',
            features: ['24/7 Availability', 'Restaurant Bookings', 'Event Access', 'Local Expertise'],
            pricePerDay: 'USD 500',
            passengers: 1,
            isActive: true,
            sortOrder: 1
        },
        {
            name: 'VIP Airport Service',
            image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=800&q=80',
            description: 'Fast-track arrivals and departures with lounge access',
            features: ['Fast Immigration', 'Lounge Access', 'Meet & Greet', 'Baggage Handling'],
            pricePerDay: 'USD 300',
            passengers: 4,
            isActive: true,
            sortOrder: 2
        }
    ],
    exclusiveAccessExperiences: [
        {
            name: 'Private Temple Ceremony',
            image: 'https://images.unsplash.com/photo-1580181046391-e7e83f206c62?auto=format&fit=crop&w=800&q=80',
            description: 'Private blessing ceremony at Temple of the Tooth',
            features: ['Private Access', 'Head Monk Blessing', 'Traditional Offerings', 'Photography Allowed'],
            pricePerDay: 'USD 2,000',
            passengers: 6,
            isActive: true,
            sortOrder: 1
        },
        {
            name: 'After-Hours Museum Tour',
            image: 'https://images.unsplash.com/photo-1588598198321-39f8c2be97ba?auto=format&fit=crop&w=800&q=80',
            description: 'Private evening tour of the National Museum',
            features: ['Exclusive Access', 'Expert Curator Guide', 'Champagne Reception', 'Photo Opportunity'],
            pricePerDay: 'USD 1,500',
            passengers: 10,
            isActive: true,
            sortOrder: 2
        }
    ],
    luxuryHotels: [
        {
            name: 'Aman Galle',
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
            description: 'Ultra-luxury resort within Galle Fort walls',
            features: ['24 Suites', 'Spa', 'Fine Dining', 'Private Beach'],
            pricePerDay: 'From USD 1,200',
            passengers: 2,
            isActive: true,
            sortOrder: 1
        },
        {
            name: 'Wild Coast Tented Lodge',
            image: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80',
            description: 'Luxury glamping near Yala National Park',
            features: ['Cocoon Tents', 'Wildlife Safari', 'Pool', 'Nature Experience'],
            pricePerDay: 'From USD 800',
            passengers: 2,
            isActive: true,
            sortOrder: 2
        }
    ],
    luxuryApartments: [
        {
            name: 'Shangri-La Residences',
            image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
            description: 'Luxury serviced apartments in Colombo',
            features: ['3 Bedrooms', 'City Views', 'Full Kitchen', 'Hotel Amenities'],
            pricePerDay: 'From USD 600',
            passengers: 6,
            isActive: true,
            sortOrder: 1
        }
    ],
    luxuryHouses: [
        {
            name: 'Geoffrey Bawa House',
            image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
            description: 'Architect-designed heritage house in Bentota',
            features: ['6 Bedrooms', 'Private Pool', 'Tropical Garden', 'Full Staff'],
            pricePerDay: 'From USD 3,000',
            passengers: 12,
            isActive: true,
            sortOrder: 1
        }
    ]
};
// TripAdvisor Tours Seed Data
const RECHARGE_TRIPADVISOR_URL = 'https://www.tripadvisor.com/Attraction_Review-g293962-d10049587-Reviews-Recharge_Travels_And_Tours-Colombo_Western_Province.html';
const TRIPADVISOR_TOURS_DATA = [
    {
        id: 'ta-0',
        title: "Discover Sri Lanka's Unique Marine Farming Culture",
        priceUsd: 40,
        rating: 4.5,
        reviews: 1,
        region: 'north',
        location: 'Ariyalai Coastal Waters, Jaffna',
        duration: '1-2 hours',
        description: "Sri Lanka's only hands-on sea cucumber farming experience",
        image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&auto=format&fit=crop',
        tripAdvisorUrl: 'https://www.tripadvisor.com/AttractionProductReview-g293962-d33108820-Discover_Sri_Lanka_s_Unique_Marine_Farming_Culture-Colombo_Western_Province.html',
        operator: 'Recharge Travels & Tours',
        operatorProfileUrl: RECHARGE_TRIPADVISOR_URL,
        isActive: true,
        sortOrder: 1
    },
    {
        id: 'ta-1',
        title: '4-Hours Colombo City Tour',
        priceUsd: 30,
        rating: 4.5,
        reviews: 1,
        region: 'west',
        location: 'Colombo',
        duration: '3-4 hours',
        description: 'Get plenty of local insight into Colombo',
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&auto=format&fit=crop',
        tripAdvisorUrl: 'https://www.tripadvisor.com/AttractionProductReview-g293962-d29711P10-4_Hours_Colombo_City_Tour-Colombo_Western_Province.html',
        operator: 'Recharge Travels & Tours',
        operatorProfileUrl: RECHARGE_TRIPADVISOR_URL,
        isActive: true,
        sortOrder: 2
    },
    {
        id: 'ta-5',
        title: 'Full Day Tour Delft and Nainativu Island Adventure from Jaffna',
        priceUsd: 90,
        rating: 4.8,
        reviews: 14,
        region: 'north',
        location: 'Delft & Nainativu Islands',
        duration: '8-10 hours',
        description: 'Visit two unique islands off the coast of Jaffna peninsula',
        image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&auto=format&fit=crop',
        tripAdvisorUrl: 'https://www.tripadvisor.com/AttractionProductReview-g304135-d26797030-Full_Day_Tour_Delft_and_Nainativu_Island_Adventure_from_Jaffna-Jaffna_Northern_Province.html',
        operator: 'Recharge Travels & Tours',
        operatorProfileUrl: RECHARGE_TRIPADVISOR_URL,
        badge: 'Best Seller',
        isActive: true,
        sortOrder: 3
    },
    {
        id: 'ta-6',
        title: 'Explore Jaffna during a Private Motorcycle Tour',
        priceUsd: 46,
        rating: 5.0,
        reviews: 24,
        region: 'north',
        location: 'Jaffna',
        duration: 'Full day',
        description: 'Private motorcycle tour of Jaffna',
        image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&auto=format&fit=crop',
        tripAdvisorUrl: 'https://www.tripadvisor.com/AttractionProductReview-g304135-Explore_Jaffna_during_a_Private_Motorcycle_Tour-Jaffna_Northern_Province.html',
        operator: 'Recharge Travels & Tours',
        operatorProfileUrl: RECHARGE_TRIPADVISOR_URL,
        badge: 'Top Rated',
        isActive: true,
        sortOrder: 4
    },
    {
        id: 'ta-14',
        title: 'Sigiriya Rock and Dambulla Cave Temple (All Inclusive Private Day Trip)',
        priceUsd: 120,
        rating: 4.7,
        reviews: 8,
        region: 'central',
        location: 'Sigiriya & Dambulla',
        duration: 'Full day',
        description: 'Visit Sigiriya Rock and Dambulla Cave Temple',
        image: 'https://images.unsplash.com/photo-1501785888041-af3ee9c470a0?w=1200&auto=format&fit=crop',
        tripAdvisorUrl: 'https://www.tripadvisor.com/AttractionProductReview-g293962-d12901824-Discover_Sigiriya_and_Hiriwadunna_Village_Private_Day_Trip_From_Colombo-Colombo_Western_Province.html',
        operator: 'Recharge Travels & Tours',
        operatorProfileUrl: RECHARGE_TRIPADVISOR_URL,
        isActive: true,
        sortOrder: 5
    },
    {
        id: 'ta-19',
        title: 'Sri Lanka North Tour',
        priceUsd: 1300,
        rating: 5.0,
        reviews: 1,
        region: 'north',
        location: 'Northern Province',
        duration: 'Multi-day',
        description: 'Comprehensive Northern Sri Lanka tour',
        image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&auto=format&fit=crop',
        tripAdvisorUrl: '',
        operator: 'Recharge Travels & Tours',
        operatorProfileUrl: RECHARGE_TRIPADVISOR_URL,
        isActive: true,
        sortOrder: 6
    }
];
// HTTP callable function to seed experience content
exports.seedExperienceContent = functions.https.onRequest(async (req, res) => {
    // Set CORS headers
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }
    // Check for admin authorization (simple key check)
    const authKey = req.headers['x-admin-key'] || req.query.key;
    if (authKey !== 'recharge-seed-2024') {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    try {
        const results = [];
        const timestamp = admin.firestore.FieldValue.serverTimestamp();
        // Seed experience content
        for (const [collectionName, content] of Object.entries(EXPERIENCE_CONTENT)) {
            await db.collection(collectionName).doc('public').set(Object.assign(Object.assign({}, content), { updatedAt: timestamp, createdAt: timestamp }));
            results.push(`✅ Seeded ${collectionName}/public`);
        }
        // Seed luxury pages content
        for (const [pageId, content] of Object.entries(LUXURY_PAGES_CONTENT)) {
            await db.collection('luxuryPages').doc(pageId).set(Object.assign(Object.assign({}, content), { updatedAt: timestamp, createdAt: timestamp }));
            results.push(`✅ Seeded luxuryPages/${pageId}`);
        }
        // Seed luxury fleet/items data
        for (const [collectionName, items] of Object.entries(LUXURY_FLEET_DATA)) {
            for (const item of items) {
                await db.collection(collectionName).add(Object.assign(Object.assign({}, item), { createdAt: timestamp, updatedAt: timestamp }));
            }
            results.push(`✅ Seeded ${collectionName} (${items.length} items)`);
        }
        // Seed TripAdvisor tours
        for (const tour of TRIPADVISOR_TOURS_DATA) {
            await db.collection('tours_tripadvisor').doc(tour.id).set(Object.assign(Object.assign({}, tour), { createdAt: timestamp, updatedAt: timestamp }));
        }
        results.push(`✅ Seeded tours_tripadvisor (${TRIPADVISOR_TOURS_DATA.length} tours)`);
        res.status(200).json({
            success: true,
            message: 'Successfully seeded all experience, luxury, and TripAdvisor content',
            results
        });
    }
    catch (error) {
        console.error('Error seeding content:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
//# sourceMappingURL=seed-experiences.js.map