
import { type EnhancedWildlifeLocation } from '../enhancedWildlifeData';

export const beachLocations: EnhancedWildlifeLocation[] = [
  {
    id: 'mirissa-beach',
    name: 'Mirissa Beach',
    lat: 5.9485,
    lng: 80.4585,
    type: 'tour',
    wildlifeType: 'beach',
    description: 'Perfect crescent beach with coconut palms and whale watching',
    wildlifeInfo: 'Famous for blue whale watching tours, stunning sunsets, and relaxed beach vibe. Best surf spot for beginners.',
    peakSeason: 'November-April',
    bestViewingTime: 'Sunset (6-7 PM)',
    accessInfo: 'Easy access by road, many beachfront restaurants',
    zoomLevel: 14,
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
        title: 'Mirissa Beach sunset',
        type: 'stock',
        source: 'Unsplash'
      },
      {
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        title: 'Coconut palm beach',
        type: 'gallery',
        source: 'Unsplash'
      }
    ]
  },

  {
    id: 'unawatuna-beach',
    name: 'Unawatuna Beach',
    lat: 6.0108,
    lng: 80.2493,
    type: 'tour',
    wildlifeType: 'beach',
    description: 'Golden sandy beach protected by coral reef',
    wildlifeInfo: 'Horseshoe-shaped bay with calm waters perfect for swimming. Rich marine life and coral reefs for snorkeling.',
    peakSeason: 'December-March',
    bestViewingTime: 'All day swimming and snorkeling',
    accessInfo: 'Near Galle, many hotels and restaurants',
    zoomLevel: 14,
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
        title: 'Unawatuna Bay',
        type: 'stock',
        source: 'Unsplash'
      },
      {
        url: 'https://images.unsplash.com/photo-1471919743851-c4df8b6ee130?w=800',
        title: 'Coral reef snorkeling',
        type: 'gallery',
        source: 'Unsplash'
      }
    ]
  },

  {
    id: 'arugam-bay',
    name: 'Arugam Bay',
    lat: 6.8400,
    lng: 81.8361,
    type: 'tour',
    wildlifeType: 'beach',
    description: 'World-renowned surfing destination',
    wildlifeInfo: 'One of the top 10 surf spots in the world. Consistent waves and laid-back surf culture. Also great for wildlife safaris.',
    peakSeason: 'April-October (surf season)',
    bestViewingTime: 'Early morning surf sessions (6-9 AM)',
    accessInfo: 'Surf shops and schools available, backpacker friendly',
    zoomLevel: 13,
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800',
        title: 'Arugam Bay surf break',
        type: 'stock',
        source: 'Unsplash'
      },
      {
        url: 'https://images.unsplash.com/photo-1471119743851-c4df8b6ee130?w=800',
        title: 'Surfing paradise',
        type: 'gallery',
        source: 'Unsplash'
      }
    ]
  },

  {
    id: 'hikkaduwa-beach',
    name: 'Hikkaduwa Beach',
    lat: 6.1391,
    lng: 80.0969,
    type: 'tour',
    wildlifeType: 'beach',
    description: 'Vibrant beach town with coral reef and nightlife',
    wildlifeInfo: 'Coral sanctuary with glass-bottom boat tours. Sea turtles frequent the area. Lively surf and party scene.',
    peakSeason: 'November-April',
    bestViewingTime: 'Snorkeling in morning (8-11 AM), surfing afternoon',
    accessInfo: 'Many beach hotels and restaurants, turtle hatchery nearby',
    zoomLevel: 14,
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
        title: 'Hikkaduwa coral reef',
        type: 'stock',
        source: 'Unsplash'
      },
      {
        url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
        title: 'Sea turtle',
        type: 'gallery',
        source: 'Unsplash'
      }
    ]
  }
];
