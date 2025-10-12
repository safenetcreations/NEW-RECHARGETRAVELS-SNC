
export interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'tour' | 'hotel' | 'transport';
  description: string;
}

// Default Sri Lankan attractions
export const defaultLocations: Location[] = [
  {
    id: '1',
    name: 'Sigiriya Rock Fortress',
    lat: 7.9568,
    lng: 80.7592,
    type: 'tour',
    description: 'Ancient rock fortress and palace ruins'
  },
  {
    id: '2',
    name: 'Temple of the Tooth - Kandy',
    lat: 7.2906,
    lng: 80.6337,
    type: 'tour',
    description: 'Sacred Buddhist temple'
  },
  {
    id: '3',
    name: 'Galle Fort',
    lat: 6.0329,
    lng: 80.2168,
    type: 'tour',
    description: 'Dutch colonial fortification'
  },
  {
    id: '4',
    name: 'Yala National Park',
    lat: 6.3726,
    lng: 81.5185,
    type: 'tour',
    description: 'Wildlife safari destination'
  },
  {
    id: '5',
    name: 'Colombo Airport',
    lat: 7.1807,
    lng: 79.8844,
    type: 'transport',
    description: 'Bandaranaike International Airport'
  }
];
