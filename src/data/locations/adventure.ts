
import { type EnhancedWildlifeLocation } from '../enhancedWildlifeData';

export const adventureLocations: EnhancedWildlifeLocation[] = [
  {
    id: 'adams-peak',
    name: 'Adam\'s Peak (Sri Pada)',
    lat: 6.8094,
    lng: 80.4993,
    type: 'tour',
    wildlifeType: 'adventure',
    description: 'Sacred mountain with pilgrimage footprint at summit',
    wildlifeInfo: 'Sacred to Buddhists, Hindus, Muslims & Christians. 2,243m peak with challenging night climb to watch sunrise.',
    peakSeason: 'December-May (pilgrimage season)',
    bestViewingTime: 'Start climb at 2-3 AM for sunrise',
    accessInfo: 'Steep 3-4 hour climb, bring torch and warm clothes',
    zoomLevel: 13,
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        title: 'Adam\'s Peak sunrise',
        type: 'stock',
        source: 'Unsplash'
      },
      {
        url: 'https://images.unsplash.com/photo-1471919743851-c4df8b6ee130?w=800',
        title: 'Mountain pilgrimage trail',
        type: 'gallery',
        source: 'Unsplash'
      }
    ]
  },

  {
    id: 'horton-plains',
    name: 'Horton Plains - World\'s End',
    lat: 6.8067,
    lng: 80.8056,
    type: 'tour',
    wildlifeType: 'adventure',
    description: 'UNESCO World Heritage montane plateau with dramatic cliff',
    wildlifeInfo: 'Unique ecosystem at 2,100m altitude. World\'s End cliff drops 870m. Home to endemic species and Baker\'s Falls.',
    peakSeason: 'December-March',
    bestViewingTime: 'Early morning (6-9 AM) before mist',
    accessInfo: '9km circular trek, permits required',
    zoomLevel: 13,
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        title: 'World\'s End cliff',
        type: 'stock',
        source: 'Unsplash'
      },
      {
        url: 'https://images.unsplash.com/photo-1471919743851-c4df8b6ee130?w=800',
        title: 'Montane grasslands',
        type: 'gallery',
        source: 'Unsplash'
      }
    ]
  },

  {
    id: 'kitulgala-rafting',
    name: 'Kitulgala White Water Rafting',
    lat: 6.9847,
    lng: 80.4175,
    type: 'tour',
    wildlifeType: 'adventure',
    description: 'Thrilling white water rafting on Kelani River',
    wildlifeInfo: 'Grade 2-3 rapids through pristine rainforest. Film location for "Bridge on the River Kwai". Rich biodiversity.',
    peakSeason: 'October-April',
    bestViewingTime: 'Morning sessions (9 AM-12 PM)',
    accessInfo: 'Professional guides provided, no experience needed',
    zoomLevel: 14,
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1471919743851-c4df8b6ee130?w=800',
        title: 'White water rafting',
        type: 'stock',
        source: 'Unsplash'
      },
      {
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        title: 'Kelani River rapids',
        type: 'gallery',
        source: 'Unsplash'
      }
    ]
  },

  {
    id: 'bentota-water-sports',
    name: 'Bentota Water Sports Hub',
    lat: 6.4218,
    lng: 79.9950,
    type: 'tour',
    wildlifeType: 'adventure',
    description: 'Premier water sports destination with golden beaches',
    wildlifeInfo: 'Jet skiing, windsurfing, parasailing, and river safaris. Madu River boat tours to see monitor lizards and birds.',
    peakSeason: 'November-April',
    bestViewingTime: 'Morning water sports (9 AM-12 PM)',
    accessInfo: 'Many water sports operators, resort area',
    zoomLevel: 13,
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
        title: 'Bentota water sports',
        type: 'stock',
        source: 'Unsplash'
      },
      {
        url: 'https://images.unsplash.com/photo-1471919743851-c4df8b6ee130?w=800',
        title: 'Golden beach',
        type: 'gallery',
        source: 'Unsplash'
      }
    ]
  }
];
