
import { wildlifeLocations } from './locations/wildlife';
import { culturalLocations } from './locations/cultural';
import { templeLocations } from './locations/temples';
import { beachLocations } from './locations/beaches';
import { waterfallLocations } from './locations/waterfalls';
import { adventureLocations } from './locations/adventure';

export interface PhotoLink {
  url: string;
  title: string;
  type: 'stock' | 'live_cam' | 'gallery';
  source?: string;
}

export interface EnhancedWildlifeLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'tour' | 'hotel' | 'transport';
  wildlifeType: 'leopard' | 'elephant' | 'whale' | 'dolphin' | 'mixed' | 'cultural' | 'turtle' | 'crocodile' | 'bird' | 'bear' | 'dugong' | 'beach' | 'temple' | 'waterfall' | 'adventure';
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
  height?: number;
  province?: string;
  difficulty?: string;
}

export const enhancedWildlifeLocations: EnhancedWildlifeLocation[] = [
  ...wildlifeLocations,
  ...culturalLocations,
  ...templeLocations,
  ...beachLocations,
  ...waterfallLocations,
  ...adventureLocations
];
