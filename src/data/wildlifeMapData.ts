
export interface PhotoLink {
  url: string;
  title: string;
  type: 'stock' | 'live_cam' | 'gallery';
  source?: string;
}

export interface WildlifeLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'tour' | 'hotel' | 'transport';
  wildlifeType: 'leopard' | 'elephant' | 'whale' | 'dolphin' | 'turtle' | 'crocodile' | 'bird' | 'bear' | 'dugong' | 'beach' | 'temple' | 'waterfall' | 'adventure' | 'cultural' | 'mixed';
  description: string;
  wildlifeInfo: string;
  peakSeason?: string;
  species?: string[];
  conservationStatus?: string;
  population?: string;
  photos: PhotoLink[];
  bestViewingTime?: string;
  accessInfo?: string;
  zoomLevel?: number;
}

export const wildlifeLocations: WildlifeLocation[] = [
  {
    id: 'yala-leopard',
    name: 'Yala National Park',
    lat: 6.3726,
    lng: 81.5185,
    type: 'tour',
    wildlifeType: 'leopard',
    description: 'Premier leopard spotting destination in Sri Lanka',
    wildlifeInfo: 'Home to the highest density of leopards in the world',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=800',
        title: 'Sri Lankan Leopard',
        type: 'stock',
        source: 'Unsplash'
      }
    ]
  },
  {
    id: 'minneriya-elephants',
    name: 'Minneriya National Park',
    lat: 8.0167,
    lng: 80.8833,
    type: 'tour',
    wildlifeType: 'elephant',
    description: 'Famous for the great elephant gathering',
    wildlifeInfo: 'Witness hundreds of elephants during the dry season',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800',
        title: 'Elephant herd',
        type: 'stock',
        source: 'Unsplash'
      }
    ]
  },
  {
    id: 'mirissa-whales',
    name: 'Mirissa',
    lat: 5.9485,
    lng: 80.4585,
    type: 'tour',
    wildlifeType: 'whale',
    description: 'Best place to see blue whales',
    wildlifeInfo: 'Blue whales and sperm whales can be spotted year-round',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1518877593221-1f28583780b4?w=800',
        title: 'Blue whale',
        type: 'stock',
        source: 'Unsplash'
      }
    ]
  }
];
