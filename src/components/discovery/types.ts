
export interface TouristLocation {
  id: number;
  name: string;
  type: string;
  lat: number;
  lng: number;
  description: string;
  wikipedia: string;
  rating: number;
  reviews: number;
  priceRange: string;
  openingHours: string;
  bestTimeToVisit: string;
  accessibility: string;
  languages: string[];
  facilities: string[];
  weatherSensitive: boolean;
  crowdLevel: string;
  photography: string;
  imageUrl?: string;
}

export interface SriLankaDiscoveryProps {
  className?: string;
  containerStyle?: React.CSSProperties;
}
