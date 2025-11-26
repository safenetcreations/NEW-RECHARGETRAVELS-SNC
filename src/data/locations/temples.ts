
import { type EnhancedWildlifeLocation } from '../enhancedWildlifeData';

export const templeLocations: EnhancedWildlifeLocation[] = [
  {
    id: 'temple-tooth-relic',
    name: 'Temple of the Sacred Tooth Relic - Kandy',
    lat: 7.2906,
    lng: 80.6337,
    type: 'tour',
    wildlifeType: 'temple',
    description: 'Sacred Buddhist temple housing Buddha\'s tooth relic',
    wildlifeInfo: 'UNESCO World Heritage Site and most sacred Buddhist temple in Sri Lanka. Site of the annual Esala Perahera festival.',
    peakSeason: 'Year-round, special during Esala Perahera (July-August)',
    bestViewingTime: 'Early morning or evening puja ceremonies',
    accessInfo: 'Modest dress required, remove shoes before entering',
    zoomLevel: 15,
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
        title: 'Temple of the Tooth',
        type: 'stock',
        source: 'Unsplash'
      },
      {
        url: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800',
        title: 'Kandy Lake view',
        type: 'gallery',
        source: 'Unsplash'
      }
    ]
  },

  {
    id: 'dambulla-cave-temple',
    name: 'Dambulla Cave Temple',
    lat: 7.8567,
    lng: 80.6509,
    type: 'tour',
    wildlifeType: 'temple',
    description: 'Largest and best-preserved cave temple complex in Sri Lanka',
    wildlifeInfo: 'Five caves with over 150 Buddha statues and extensive murals dating back to 1st century BC.',
    peakSeason: 'December-April',
    bestViewingTime: 'Early morning (7-9 AM)',
    accessInfo: 'Climb up 15-minute walk, modest dress required',
    zoomLevel: 14,
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
        title: 'Dambulla Cave Temple',
        type: 'stock',
        source: 'Unsplash'
      },
      {
        url: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800',
        title: 'Ancient Buddha statues',
        type: 'gallery',
        source: 'Unsplash'
      }
    ]
  },

  {
    id: 'trincomalee-harbor',
    name: 'Trincomalee Harbor & Koneswaram Temple',
    lat: 8.5874,
    lng: 81.2152,
    type: 'tour',
    wildlifeType: 'temple',
    description: 'Natural deep-water harbor with ancient Hindu temple',
    wildlifeInfo: 'One of world\'s finest natural harbors. Koneswaram Temple perched on cliff, sacred to Hindus for over 2000 years.',
    peakSeason: 'April-September',
    bestViewingTime: 'Sunset from temple (5-7 PM)',
    accessInfo: 'Temple free entry, harbor views from Fort Frederick',
    zoomLevel: 13,
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
        title: 'Koneswaram Temple',
        type: 'stock',
        source: 'Unsplash'
      },
      {
        url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
        title: 'Trincomalee harbor',
        type: 'gallery',
        source: 'Unsplash'
      }
    ]
  },

  {
    id: 'nallur-temple',
    name: 'Nallur Kandaswamy Kovil - Jaffna',
    lat: 9.6781,
    lng: 80.0178,
    type: 'tour',
    wildlifeType: 'temple',
    description: 'Most significant Hindu temple in Northern Sri Lanka',
    wildlifeInfo: 'Dedicated to Lord Murugan, center of annual Nallur Festival. Important pilgrimage site with 400+ year history.',
    peakSeason: 'July-August (festival season)',
    bestViewingTime: 'Evening puja ceremonies (6-8 PM)',
    accessInfo: 'Modest dress required, special ceremonies during festivals',
    zoomLevel: 15,
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
        title: 'Nallur Kovil',
        type: 'stock',
        source: 'Unsplash'
      },
      {
        url: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800',
        title: 'Hindu temple architecture',
        type: 'gallery',
        source: 'Unsplash'
      }
    ]
  }
];
