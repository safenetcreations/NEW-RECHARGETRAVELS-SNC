
export const VEHICLE_TYPES = [
  {
    value: 'sedan',
    label: 'Economy Sedan',
    description: 'Comfortable for up to 3 passengers',
    icon: '🚗',
    features: ['Air Conditioning', 'Music System', 'Comfortable Seats'],
    maxPassengers: 4,
    maxLuggage: 3
  },
  {
    value: 'suv',
    label: 'Comfort SUV',
    description: 'Spacious for families',
    icon: '🚙',
    features: ['Extra Space', 'Premium Comfort', 'Large Boot Space'],
    maxPassengers: 6,
    maxLuggage: 5
  },
  {
    value: 'van',
    label: 'Premium Van',
    description: 'Perfect for groups',
    icon: '🚐',
    features: ['Group Seating', 'Ample Luggage Space', 'Entertainment System'],
    maxPassengers: 8,
    maxLuggage: 8
  },
  {
    value: 'luxury',
    label: 'Luxury SUV',
    description: 'Premium experience',
    icon: '✨',
    features: ['Luxury Interior', 'Premium Service', 'Complimentary Water'],
    maxPassengers: 4,
    maxLuggage: 4
  }
];

export const POPULAR_LOCATIONS = [
  {
    category: 'Airports',
    locations: [
      {
        name: 'Bandaranaike International Airport',
        address: 'Canada Friendship Rd, Katunayake',
        coordinates: { lat: 7.1807, lng: 79.8841 }
      },
      {
        name: 'Ratmalana Airport',
        address: 'Ratmalana',
        coordinates: { lat: 6.8219, lng: 79.8862 }
      }
    ]
  },
  {
    category: 'Hotels',
    locations: [
      {
        name: 'Galle Face Hotel',
        address: '2 Galle Rd, Colombo 00300',
        coordinates: { lat: 6.9250, lng: 79.8416 }
      },
      {
        name: 'Cinnamon Grand Colombo',
        address: '77 Galle Rd, Colombo 00300',
        coordinates: { lat: 6.9171, lng: 79.8478 }
      },
      {
        name: 'Shangri-La Hotel',
        address: '1 Galle Face, Colombo 00200',
        coordinates: { lat: 6.9295, lng: 79.8447 }
      }
    ]
  },
  {
    category: 'Tourist Attractions',
    locations: [
      {
        name: 'Gangaramaya Temple',
        address: '61 Sri Jinarathana Rd, Colombo',
        coordinates: { lat: 6.9167, lng: 79.8564 }
      },
      {
        name: 'Galle Fort',
        address: 'Galle Fort, Galle',
        coordinates: { lat: 6.0267, lng: 80.2170 }
      }
    ]
  }
];

export const BOOKING_STATUS_COLORS = {
  pending: 'yellow',
  confirmed: 'blue',
  in_progress: 'green',
  completed: 'gray',
  cancelled: 'red'
};

export const BOOKING_STATUS_LABELS = {
  pending: 'Pending Confirmation',
  confirmed: 'Confirmed',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled'
};
