import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, updateDoc, doc, setDoc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "recharge-travels-73e76.firebaseapp.com",
  projectId: "recharge-travels-73e76",
  storageBucket: "recharge-travels-73e76.appspot.com",
  messagingSenderId: "515581447537",
  appId: "1:515581447537:web:b4f65bf9c2544c65d6fad0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Real Sri Lanka Tour Data
const realTours = [
  {
    id: 'cultural-heritage-tour',
    title: 'Cultural Heritage Tour - Ancient Kingdoms',
    description: 'Explore the rich cultural heritage of Sri Lanka through ancient kingdoms, UNESCO World Heritage sites, and traditional villages.',
    duration: '7 days / 6 nights',
    price: 1250,
    currency: 'USD',
    category: 'cultural',
    destinations: ['Anuradhapura', 'Polonnaruwa', 'Sigiriya', 'Kandy', 'Dambulla'],
    highlights: [
      'Visit UNESCO World Heritage sites',
      'Explore ancient Buddhist temples',
      'Traditional village experiences',
      'Cultural performances',
      'Local cuisine tasting'
    ],
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'
    ],
    included: [
      'Accommodation in 4-star hotels',
      'Daily breakfast and dinner',
      'Professional English-speaking guide',
      'Air-conditioned vehicle',
      'All entrance fees',
      'Cultural show tickets'
    ],
    excluded: [
      'International flights',
      'Lunch',
      'Personal expenses',
      'Tips for guide and driver'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Colombo',
        description: 'Welcome to Sri Lanka! Transfer to your hotel in Colombo.',
        activities: ['Airport pickup', 'Hotel check-in', 'Welcome dinner']
      },
      {
        day: 2,
        title: 'Colombo to Anuradhapura',
        description: 'Travel to the ancient city of Anuradhapura, a UNESCO World Heritage site.',
        activities: ['Visit Sacred Bo Tree', 'Explore ancient ruins', 'Buddhist temple tour']
      }
    ],
    availability: {
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      maxGroupSize: 12,
      minGroupSize: 2
    },
    rating: 4.8,
    reviewCount: 156,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'beach-paradise-tour',
    title: 'Beach Paradise Tour - Southern Coast',
    description: 'Discover the pristine beaches of Sri Lanka\'s southern coast with crystal clear waters and golden sands.',
    duration: '5 days / 4 nights',
    price: 890,
    currency: 'USD',
    category: 'beach',
    destinations: ['Galle', 'Mirissa', 'Unawatuna', 'Bentota'],
    highlights: [
      'Whale watching in Mirissa',
      'Galle Fort exploration',
      'Beach relaxation',
      'Water sports activities',
      'Sunset beach dinners'
    ],
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop'
    ],
    included: [
      'Beachfront hotel accommodation',
      'Daily breakfast',
      'Whale watching tour',
      'Galle Fort guided tour',
      'Beach equipment rental',
      'Sunset dinner cruise'
    ],
    excluded: [
      'International flights',
      'Lunch and dinner',
      'Personal expenses',
      'Water sports fees'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Galle',
        description: 'Welcome to the southern coast! Check into your beachfront hotel.',
        activities: ['Airport pickup', 'Hotel check-in', 'Beach welcome']
      },
      {
        day: 2,
        title: 'Galle Fort & Mirissa',
        description: 'Explore the historic Galle Fort and head to Mirissa for whale watching.',
        activities: ['Galle Fort tour', 'Whale watching', 'Beach relaxation']
      }
    ],
    availability: {
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      maxGroupSize: 8,
      minGroupSize: 2
    },
    rating: 4.9,
    reviewCount: 203,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'wildlife-safari-tour',
    title: 'Wildlife Safari Adventure',
    description: 'Experience the incredible wildlife of Sri Lanka with safari adventures in national parks.',
    duration: '6 days / 5 nights',
    price: 1450,
    currency: 'USD',
    category: 'wildlife',
    destinations: ['Yala National Park', 'Udawalawe National Park', 'Minneriya National Park'],
    highlights: [
      'Leopard spotting in Yala',
      'Elephant herds in Udawalawe',
      'Bird watching',
      'Safari jeep rides',
      'Wildlife photography'
    ],
    images: [
      'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'
    ],
    included: [
      'Luxury tented accommodation',
      'All meals included',
      'Multiple safari drives',
      'Expert wildlife guide',
      'Safari vehicle',
      'Park entrance fees'
    ],
    excluded: [
      'International flights',
      'Personal expenses',
      'Tips for guides',
      'Camera equipment rental'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival & Yala Safari',
        description: 'Arrive at Yala National Park and enjoy your first safari drive.',
        activities: ['Airport pickup', 'Safari lodge check-in', 'Evening safari']
      },
      {
        day: 2,
        title: 'Full Day Yala Safari',
        description: 'Full day of wildlife viewing in Yala National Park.',
        activities: ['Morning safari', 'Afternoon safari', 'Wildlife photography']
      }
    ],
    availability: {
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      maxGroupSize: 6,
      minGroupSize: 2
    },
    rating: 4.7,
    reviewCount: 89,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'tea-country-tour',
    title: 'Tea Country & Hill Stations',
    description: 'Explore the beautiful hill country of Sri Lanka with tea plantations and cool mountain air.',
    duration: '4 days / 3 nights',
    price: 750,
    currency: 'USD',
    category: 'nature',
    destinations: ['Nuwara Eliya', 'Ella', 'Kandy'],
    highlights: [
      'Tea plantation visits',
      'Train journey through hills',
      'Waterfall exploration',
      'Cool mountain climate',
      'Local tea tasting'
    ],
    images: [
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=800&h=600&fit=crop'
    ],
    included: [
      'Mountain hotel accommodation',
      'Daily breakfast',
      'Tea plantation tour',
      'Train tickets',
      'Local guide',
      'Tea factory visit'
    ],
    excluded: [
      'International flights',
      'Lunch and dinner',
      'Personal expenses',
      'Optional activities'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Nuwara Eliya',
        description: 'Welcome to the hill country! Check into your mountain hotel.',
        activities: ['Airport pickup', 'Hotel check-in', 'City tour']
      },
      {
        day: 2,
        title: 'Tea Plantation Tour',
        description: 'Visit tea plantations and learn about tea production.',
        activities: ['Tea factory tour', 'Plantation walk', 'Tea tasting']
      }
    ],
    availability: {
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      maxGroupSize: 10,
      minGroupSize: 2
    },
    rating: 4.6,
    reviewCount: 134,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Real Destination Data
const realDestinations = [
  {
    id: 'colombo',
    name: 'Colombo',
    region: 'Western Province',
    description: 'The vibrant capital city of Sri Lanka, Colombo is a bustling metropolis that blends colonial architecture with modern development.',
    highlights: [
      'Gangaramaya Temple',
      'Independence Square',
      'Galle Face Green',
      'National Museum',
      'Shopping at Odel'
    ],
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=800&h=600&fit=crop'
    ],
    bestTime: 'December to April',
    transport: ['Airport transfers', 'Tuk-tuk tours', 'Walking tours'],
    accommodation: ['Luxury hotels', 'Boutique hotels', 'Guesthouses'],
    activities: ['City tours', 'Shopping', 'Dining', 'Cultural visits'],
    rating: 4.5,
    reviewCount: 234,
    featured: true
  },
  {
    id: 'kandy',
    name: 'Kandy',
    region: 'Central Province',
    description: 'The cultural capital of Sri Lanka, Kandy is home to the Temple of the Sacred Tooth Relic and offers a rich cultural experience.',
    highlights: [
      'Temple of the Sacred Tooth Relic',
      'Royal Botanical Gardens',
      'Kandy Lake',
      'Cultural dance shows',
      'Tea plantations'
    ],
    images: [
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'
    ],
    bestTime: 'January to April',
    transport: ['Train from Colombo', 'Private transfers', 'Local buses'],
    accommodation: ['Heritage hotels', 'Mountain resorts', 'Guesthouses'],
    activities: ['Temple visits', 'Garden tours', 'Cultural shows', 'Tea tours'],
    rating: 4.8,
    reviewCount: 189,
    featured: true
  },
  {
    id: 'sigiriya',
    name: 'Sigiriya',
    region: 'Cultural Triangle',
    description: 'Home to the ancient rock fortress, Sigiriya is a UNESCO World Heritage site and one of Sri Lanka\'s most iconic landmarks.',
    highlights: [
      'Sigiriya Rock Fortress',
      'Ancient frescoes',
      'Lion\'s Paw entrance',
      'Water gardens',
      'Sunset views'
    ],
    images: [
      'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'
    ],
    bestTime: 'February to October',
    transport: ['Private transfers', 'Local buses', 'Tuk-tuk'],
    accommodation: ['Luxury resorts', 'Eco lodges', 'Guesthouses'],
    activities: ['Rock climbing', 'Archaeological tours', 'Village visits', 'Sunset viewing'],
    rating: 4.9,
    reviewCount: 312,
    featured: true
  },
  {
    id: 'galle',
    name: 'Galle',
    region: 'Southern Province',
    description: 'A historic coastal city with a well-preserved Dutch fort, Galle offers a perfect blend of history, culture, and beach life.',
    highlights: [
      'Galle Fort',
      'Historic lighthouse',
      'Beach activities',
      'Dutch architecture',
      'Sunset views'
    ],
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop'
    ],
    bestTime: 'November to April',
    transport: ['Train from Colombo', 'Private transfers', 'Local buses'],
    accommodation: ['Fort hotels', 'Beach resorts', 'Boutique hotels'],
    activities: ['Fort walking tours', 'Beach activities', 'Shopping', 'Dining'],
    rating: 4.7,
    reviewCount: 267,
    featured: true
  },
  {
    id: 'jaffna',
    name: 'Jaffna',
    region: 'Northern Province',
    description: 'The cultural heart of Tamil Sri Lanka, Jaffna offers unique experiences with its distinct culture, cuisine, and heritage.',
    highlights: [
      'Jaffna Fort',
      'Nallur Kandaswamy Temple',
      'Local cuisine',
      'Island hopping',
      'Cultural experiences'
    ],
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=800&h=600&fit=crop'
    ],
    bestTime: 'January to September',
    transport: ['Flight from Colombo', 'Train', 'Private transfers'],
    accommodation: ['Local hotels', 'Guesthouses', 'Homestays'],
    activities: ['Temple visits', 'Cultural tours', 'Food tours', 'Island visits'],
    rating: 4.4,
    reviewCount: 98,
    featured: false
  }
];

// Real Hotel Data
const realHotels = [
  {
    id: 'colombo-luxury-hotel',
    name: 'Colombo Luxury Hotel',
    location: 'Colombo',
    category: 'luxury',
    rating: 4.8,
    price: 250,
    currency: 'USD',
    description: 'A 5-star luxury hotel in the heart of Colombo with world-class amenities and service.',
    amenities: [
      'Swimming pool',
      'Spa & wellness center',
      'Fine dining restaurants',
      'Business center',
      'Concierge service',
      'Airport transfers'
    ],
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'
    ],
    rooms: [
      {
        type: 'Deluxe Room',
        price: 250,
        capacity: 2,
        amenities: ['King bed', 'City view', 'Balcony', 'Mini bar']
      },
      {
        type: 'Suite',
        price: 450,
        capacity: 4,
        amenities: ['Living room', 'Ocean view', 'Butler service', 'Private terrace']
      }
    ],
    featured: true
  },
  {
    id: 'kandy-heritage-hotel',
    name: 'Kandy Heritage Hotel',
    location: 'Kandy',
    category: 'heritage',
    rating: 4.6,
    price: 180,
    currency: 'USD',
    description: 'A beautifully restored heritage hotel in Kandy offering authentic Sri Lankan hospitality.',
    amenities: [
      'Garden restaurant',
      'Tea lounge',
      'Cultural shows',
      'Mountain views',
      'Free WiFi',
      'Room service'
    ],
    images: [
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=800&h=600&fit=crop'
    ],
    rooms: [
      {
        type: 'Heritage Room',
        price: 180,
        capacity: 2,
        amenities: ['Four-poster bed', 'Garden view', 'Antique furniture', 'Private bathroom']
      }
    ],
    featured: true
  }
];

// Seed function
async function seedRealContent() {
  try {
    console.log('🌱 Starting to seed real content...');

    // Seed Tours
    console.log('📦 Seeding tours...');
    for (const tour of realTours) {
      await setDoc(doc(db, 'tours', tour.id), tour);
      console.log(`✅ Added tour: ${tour.title}`);
    }

    // Seed Destinations
    console.log('🗺️ Seeding destinations...');
    for (const destination of realDestinations) {
      await setDoc(doc(db, 'destinations', destination.id), destination);
      console.log(`✅ Added destination: ${destination.name}`);
    }

    // Seed Hotels
    console.log('🏨 Seeding hotels...');
    for (const hotel of realHotels) {
      await setDoc(doc(db, 'hotels', hotel.id), hotel);
      console.log(`✅ Added hotel: ${hotel.name}`);
    }

    console.log('🎉 All real content seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding content:', error);
  }
}

// Run the seeding
seedRealContent(); 