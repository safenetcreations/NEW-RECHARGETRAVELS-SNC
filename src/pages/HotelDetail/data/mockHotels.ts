// Comprehensive mock hotel data that matches the listing page
export const mockHotelsData = [
  // 5-Star Luxury Hotels
  {
    id: '1',
    name: 'Shangri-La Colombo',
    description: 'Experience unparalleled luxury at Shangri-La Colombo, a stunning beachfront hotel offering world-class amenities and exceptional service. Located along the vibrant Galle Face waterfront, this iconic property features elegant rooms with panoramic ocean views, multiple award-winning restaurants, a luxurious spa, and an infinity pool overlooking the Indian Ocean. Perfect for both business and leisure travelers seeking the finest hospitality in Sri Lanka\'s capital city.',
    star_rating: 5,
    hotel_type: 'luxury_resort',
    base_price_per_night: 250,
    address: '1 Galle Face, Colombo 00200, Sri Lanka',
    city: { id: '1', name: 'Colombo', country: 'Sri Lanka' },
    amenities: ['Free WiFi', 'Swimming Pool', 'Spa & Wellness', 'Fitness Center', 'Multiple Restaurants', 'Beach Access', '24/7 Concierge', 'Room Service', 'Business Center', 'Valet Parking', 'Airport Shuttle', 'Kids Club'],
    is_active: true,
    average_rating: 4.8,
    review_count: 1250,
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&h=800&fit=crop'
    ],
    room_types: [
      {
        id: 'deluxe-ocean',
        hotel_id: '1',
        name: 'Deluxe Ocean View Room',
        description: 'Spacious 45sqm room with stunning ocean views, king-size bed, marble bathroom with soaking tub, and private balcony.',
        price_per_night: 250,
        max_occupancy: 2,
        bed_type: 'King Bed',
        size_sqm: 45,
        amenities: ['Ocean View', 'Private Balcony', 'Rain Shower', 'Soaking Tub', 'Mini Bar', 'Nespresso Machine', 'Smart TV', 'Work Desk'],
        images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop'],
        available_count: 15,
        is_active: true
      },
      {
        id: 'horizon-club',
        hotel_id: '1',
        name: 'Horizon Club Room',
        description: 'Premium 50sqm room with exclusive lounge access, complimentary breakfast, evening cocktails, and personalized butler service.',
        price_per_night: 350,
        max_occupancy: 2,
        bed_type: 'King Bed',
        size_sqm: 50,
        amenities: ['Club Lounge Access', 'Butler Service', 'Free Breakfast', 'Evening Cocktails', 'Late Checkout', 'Airport Transfer'],
        images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop'],
        available_count: 10,
        is_active: true
      },
      {
        id: 'presidential-suite',
        hotel_id: '1',
        name: 'Presidential Suite',
        description: 'Luxurious 150sqm suite with separate living room, dining area, private terrace, and panoramic city and ocean views.',
        price_per_night: 850,
        max_occupancy: 4,
        bed_type: 'King Bed + Sofa Bed',
        size_sqm: 150,
        amenities: ['Separate Living Room', 'Private Terrace', 'Dining Room', 'Kitchen', 'Jacuzzi', '24/7 Butler', 'Limousine Service'],
        images: ['https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop'],
        available_count: 2,
        is_active: true
      }
    ],
    policies: {
      check_in: '3:00 PM',
      check_out: '12:00 PM',
      cancellation: 'Free cancellation up to 48 hours before check-in',
      children: 'Children of all ages are welcome',
      pets: 'Pets are not allowed',
      smoking: 'Non-smoking property'
    },
    highlights: ['Beachfront Location', 'Michelin-Star Dining', 'Award-Winning Spa', 'Infinity Pool'],
    nearby: ['Galle Face Green (0.1km)', 'National Museum (2km)', 'Gangaramaya Temple (1.5km)', 'Independence Square (3km)']
  },
  {
    id: '2',
    name: 'Cinnamon Grand Colombo',
    description: 'Cinnamon Grand is one of Colombo\'s most prestigious hotels, blending contemporary luxury with warm Sri Lankan hospitality. This landmark property features 501 elegantly appointed rooms and suites, 8 distinctive restaurants, a world-class spa, and exceptional meeting facilities. Ideally located in the heart of the city, it\'s the perfect base for exploring Colombo\'s cultural attractions and business district.',
    star_rating: 5,
    hotel_type: 'luxury_resort',
    base_price_per_night: 180,
    address: '77 Galle Road, Colombo 00300, Sri Lanka',
    city: { id: '1', name: 'Colombo', country: 'Sri Lanka' },
    amenities: ['Free WiFi', 'Swimming Pool', 'Spa', 'Fitness Center', '8 Restaurants', 'Business Center', 'Casino', 'Shopping Arcade', 'Tennis Court', 'Kids Activities'],
    is_active: true,
    average_rating: 4.6,
    review_count: 890,
    images: [
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&h=800&fit=crop'
    ],
    room_types: [
      {
        id: 'superior-room',
        hotel_id: '2',
        name: 'Superior Room',
        description: 'Comfortable 32sqm room with city views, plush bedding, and modern amenities.',
        price_per_night: 180,
        max_occupancy: 2,
        bed_type: 'King or Twin Beds',
        size_sqm: 32,
        amenities: ['City View', 'Work Desk', 'Mini Bar', 'Safe', 'Tea/Coffee Maker'],
        images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop'],
        available_count: 50,
        is_active: true
      },
      {
        id: 'deluxe-room',
        hotel_id: '2',
        name: 'Deluxe Room',
        description: 'Spacious 40sqm room on higher floors with premium amenities and stunning views.',
        price_per_night: 220,
        max_occupancy: 2,
        bed_type: 'King Bed',
        size_sqm: 40,
        amenities: ['Premium View', 'Bathtub', 'Lounge Area', 'Premium Toiletries'],
        images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop'],
        available_count: 30,
        is_active: true
      }
    ],
    policies: {
      check_in: '2:00 PM',
      check_out: '12:00 PM',
      cancellation: 'Free cancellation up to 24 hours before check-in',
      children: 'Children under 6 stay free',
      pets: 'Pets are not allowed',
      smoking: 'Smoking rooms available on request'
    },
    highlights: ['Central Location', '8 Dining Options', 'Award-Winning Spa', 'Casino'],
    nearby: ['Galle Face Beach (1km)', 'Dutch Hospital Shopping (2km)', 'Viharamahadevi Park (1km)']
  },
  {
    id: '3',
    name: 'Anantara Peace Haven Tangalle Resort',
    description: 'Escape to paradise at Anantara Peace Haven, an exclusive clifftop resort overlooking the Indian Ocean. This stunning property offers private pool villas, world-class dining, an award-winning spa, and authentic Sri Lankan experiences. Watch sea turtles nest on pristine beaches, embark on whale watching excursions, or simply relax in your private infinity pool.',
    star_rating: 5,
    hotel_type: 'luxury_resort',
    base_price_per_night: 320,
    address: 'Goyambokka Estate, Tangalle, Sri Lanka',
    city: { id: '2', name: 'Tangalle', country: 'Sri Lanka' },
    amenities: ['Private Pool Villas', 'Spa', 'Beach Access', 'Butler Service', 'Yoga Pavilion', 'Cooking Classes', 'Turtle Conservation', 'Whale Watching', 'Infinity Pool'],
    is_active: true,
    average_rating: 4.9,
    review_count: 650,
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1200&h=800&fit=crop'
    ],
    room_types: [
      {
        id: 'garden-villa',
        hotel_id: '3',
        name: 'Garden Pool Villa',
        description: 'Secluded 100sqm villa with private plunge pool, outdoor shower, and lush garden setting.',
        price_per_night: 320,
        max_occupancy: 2,
        bed_type: 'King Bed',
        size_sqm: 100,
        amenities: ['Private Pool', 'Garden', 'Outdoor Shower', 'Butler Service', 'Minibar'],
        images: ['https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&h=600&fit=crop'],
        available_count: 20,
        is_active: true
      },
      {
        id: 'ocean-villa',
        hotel_id: '3',
        name: 'Ocean Pool Villa',
        description: 'Stunning 120sqm villa perched on the cliff with infinity pool and panoramic ocean views.',
        price_per_night: 480,
        max_occupancy: 2,
        bed_type: 'King Bed',
        size_sqm: 120,
        amenities: ['Ocean View', 'Infinity Pool', 'Sun Deck', 'Outdoor Dining', 'Butler Service'],
        images: ['https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&h=600&fit=crop'],
        available_count: 10,
        is_active: true
      }
    ],
    policies: {
      check_in: '3:00 PM',
      check_out: '12:00 PM',
      cancellation: 'Free cancellation up to 72 hours before check-in',
      children: 'Children welcome with babysitting available',
      pets: 'Pets are not allowed',
      smoking: 'Outdoor smoking areas only'
    },
    highlights: ['Private Pool Villas', 'Clifftop Location', 'Turtle Watching', 'Whale Watching'],
    nearby: ['Tangalle Beach (0.5km)', 'Mulkirigala Rock Temple (20km)', 'Yala National Park (60km)']
  },
  {
    id: '4',
    name: 'Hilton Colombo',
    description: 'Hilton Colombo stands as one of the city\'s premier business hotels, offering panoramic views of the Indian Ocean and Beira Lake. This sophisticated property features 387 rooms, world-class dining options, extensive meeting facilities, and the city\'s largest hotel swimming pool. Ideally located in the business district with easy access to shopping and entertainment.',
    star_rating: 4,
    hotel_type: 'business',
    base_price_per_night: 140,
    address: '2 Sir Chittampalam A Gardiner Mawatha, Colombo 00200, Sri Lanka',
    city: { id: '1', name: 'Colombo', country: 'Sri Lanka' },
    amenities: ['Free WiFi', 'Large Pool', 'Fitness Center', 'Business Center', 'Multiple Restaurants', 'Executive Lounge', 'Conference Rooms', 'Spa'],
    is_active: true,
    average_rating: 4.3,
    review_count: 1200,
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=800&fit=crop'
    ],
    room_types: [
      {
        id: 'guest-room',
        hotel_id: '4',
        name: 'Guest Room',
        description: 'Well-appointed 32sqm room with city or lake views and modern amenities.',
        price_per_night: 140,
        max_occupancy: 2,
        bed_type: 'King or Twin Beds',
        size_sqm: 32,
        amenities: ['City/Lake View', 'Work Desk', 'Mini Bar', 'Safe'],
        images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop'],
        available_count: 100,
        is_active: true
      },
      {
        id: 'executive-room',
        hotel_id: '4',
        name: 'Executive Room',
        description: 'Premium 38sqm room with executive lounge access and enhanced amenities.',
        price_per_night: 190,
        max_occupancy: 2,
        bed_type: 'King Bed',
        size_sqm: 38,
        amenities: ['Lounge Access', 'Free Breakfast', 'Evening Cocktails', 'Priority Service'],
        images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop'],
        available_count: 40,
        is_active: true
      }
    ],
    policies: {
      check_in: '2:00 PM',
      check_out: '12:00 PM',
      cancellation: 'Free cancellation up to 24 hours before check-in',
      children: 'Children under 12 stay free with existing bedding',
      pets: 'Service animals only',
      smoking: 'Non-smoking rooms available'
    },
    highlights: ['Business Facilities', 'Largest Hotel Pool', 'Lake & Ocean Views', 'Central Location'],
    nearby: ['World Trade Center (0.5km)', 'Galle Face Beach (1km)', 'Fort Railway Station (1.5km)']
  },
  {
    id: '5',
    name: 'Jetwing Beach Negombo',
    description: 'Jetwing Beach is a stunning beachfront property in Negombo, just 10 minutes from the international airport. This eco-friendly resort features contemporary design, beautiful gardens, and direct beach access. Perfect for travelers starting or ending their Sri Lankan adventure, with excellent dining, spa facilities, and water sports.',
    star_rating: 4,
    hotel_type: 'boutique',
    base_price_per_night: 95,
    address: 'Ethukala, Negombo, Sri Lanka',
    city: { id: '3', name: 'Negombo', country: 'Sri Lanka' },
    amenities: ['Beach Access', 'Swimming Pool', 'Spa', 'Water Sports', 'Restaurant', 'Bar', 'Airport Shuttle', 'Bicycle Rental'],
    is_active: true,
    average_rating: 4.4,
    review_count: 780,
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1559599746-8823b38544c6?w=1200&h=800&fit=crop'
    ],
    room_types: [
      {
        id: 'deluxe-garden',
        hotel_id: '5',
        name: 'Deluxe Room - Garden View',
        description: 'Bright 35sqm room overlooking tropical gardens with contemporary decor.',
        price_per_night: 95,
        max_occupancy: 2,
        bed_type: 'King or Twin Beds',
        size_sqm: 35,
        amenities: ['Garden View', 'Balcony', 'Air Conditioning', 'Mini Bar'],
        images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop'],
        available_count: 40,
        is_active: true
      },
      {
        id: 'deluxe-ocean',
        hotel_id: '5',
        name: 'Deluxe Room - Ocean View',
        description: 'Premium 35sqm room with stunning ocean views and private balcony.',
        price_per_night: 130,
        max_occupancy: 2,
        bed_type: 'King Bed',
        size_sqm: 35,
        amenities: ['Ocean View', 'Private Balcony', 'Sunset Views', 'Premium Amenities'],
        images: ['https://images.unsplash.com/photo-1559599746-8823b38544c6?w=800&h=600&fit=crop'],
        available_count: 30,
        is_active: true
      }
    ],
    policies: {
      check_in: '2:00 PM',
      check_out: '12:00 PM',
      cancellation: 'Free cancellation up to 24 hours before check-in',
      children: 'Family-friendly with kids menu',
      pets: 'Pets are not allowed',
      smoking: 'Non-smoking property'
    },
    highlights: ['Airport Proximity', 'Beach Access', 'Eco-Friendly', 'Water Sports'],
    nearby: ['Negombo Beach (0km)', 'Fish Market (2km)', 'Airport (7km)', 'St. Mary\'s Church (3km)']
  }
]

// Additional hotels for other IDs (6-16)
const additionalHotels = [
  { id: '6', name: 'Heritance Kandalama', city: 'Dambulla', price: 180, rating: 4.7, type: 'eco_lodge', description: 'Geoffrey Bawa\'s architectural masterpiece set in a jungle overlooking ancient reservoirs.' },
  { id: '7', name: 'Tea Trails Norwood', city: 'Hatton', price: 450, rating: 4.9, type: 'boutique', description: 'Colonial tea bungalows with butler service in the heart of Sri Lanka\'s tea country.' },
  { id: '8', name: 'Cape Weligama', city: 'Weligama', price: 380, rating: 4.8, type: 'luxury_resort', description: 'Clifftop luxury resort with stunning ocean views and private beach access.' },
  { id: '9', name: 'Wild Coast Tented Lodge', city: 'Yala', price: 650, rating: 4.9, type: 'safari_lodge', description: 'Luxury tented camp at the edge of Yala National Park with private plunge pools.' },
  { id: '10', name: '98 Acres Resort', city: 'Ella', price: 150, rating: 4.5, type: 'boutique', description: 'Mountain retreat with panoramic views of Ella Gap and Little Adam\'s Peak.' },
  { id: '11', name: 'Fort Bazaar', city: 'Galle', price: 200, rating: 4.6, type: 'boutique', description: 'Boutique heritage hotel in the heart of Galle Fort UNESCO World Heritage Site.' },
  { id: '12', name: 'Colombo City Apartments', city: 'Colombo', price: 110, rating: 4.3, type: 'apartment', description: 'Modern serviced apartments in the heart of Colombo\'s business district.' },
  { id: '13', name: 'Heritage Guesthouse', city: 'Galle', price: 50, rating: 4.0, type: 'guesthouse', description: 'Charming colonial-era guesthouse with traditional Sri Lankan hospitality.' },
  { id: '14', name: 'Rainforest Eco Lodge', city: 'Udawalawe', price: 120, rating: 4.5, type: 'eco_lodge', description: 'Sustainable eco-lodge near Udawalawe National Park with wildlife focus.' },
  { id: '15', name: 'Backpacker Paradise', city: 'Hikkaduwa', price: 25, rating: 3.7, type: 'budget', description: 'Budget-friendly accommodation for surf and beach lovers.' },
  { id: '16', name: 'Serene Lake House', city: 'Galle', price: 200, rating: 4.8, type: 'vacation_home', description: 'Beautiful vacation home overlooking Koggala Lake, perfect for families.' }
]

// Function to get hotel by ID
export const getMockHotelById = (id: string) => {
  // Check main detailed hotels first
  const detailedHotel = mockHotelsData.find(h => h.id === id)
  if (detailedHotel) {
    return {
      ...detailedHotel,
      images: detailedHotel.images || [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=800&fit=crop'
      ]
    }
  }
  
  // Check additional hotels
  const additionalHotel = additionalHotels.find(h => h.id === id)
  if (additionalHotel) {
    return {
      id: additionalHotel.id,
      name: additionalHotel.name,
      description: additionalHotel.description,
      star_rating: Math.round(additionalHotel.rating),
      hotel_type: additionalHotel.type,
      base_price_per_night: additionalHotel.price,
      address: `${additionalHotel.city}, Sri Lanka`,
      city: { id: additionalHotel.id, name: additionalHotel.city, country: 'Sri Lanka' },
      amenities: ['Free WiFi', 'Air Conditioning', 'Restaurant', 'Room Service', '24/7 Front Desk'],
      is_active: true,
      average_rating: additionalHotel.rating,
      review_count: Math.floor(Math.random() * 500) + 100,
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&h=800&fit=crop'
      ],
      room_types: [
        {
          id: 'standard-room',
          hotel_id: additionalHotel.id,
          name: 'Standard Room',
          description: 'Comfortable room with all essential amenities.',
          price_per_night: additionalHotel.price,
          max_occupancy: 2,
          bed_type: 'King or Twin Beds',
          size_sqm: 28,
          amenities: ['Air Conditioning', 'WiFi', 'TV', 'Private Bathroom'],
          images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop'],
          available_count: 20,
          is_active: true
        },
        {
          id: 'deluxe-room',
          hotel_id: additionalHotel.id,
          name: 'Deluxe Room',
          description: 'Spacious room with premium amenities and better views.',
          price_per_night: Math.round(additionalHotel.price * 1.3),
          max_occupancy: 2,
          bed_type: 'King Bed',
          size_sqm: 35,
          amenities: ['Better View', 'Bathtub', 'Mini Bar', 'Work Desk'],
          images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop'],
          available_count: 10,
          is_active: true
        }
      ],
      policies: {
        check_in: '2:00 PM',
        check_out: '12:00 PM',
        cancellation: 'Free cancellation up to 24 hours before check-in',
        children: 'Children welcome',
        pets: 'Pets are not allowed',
        smoking: 'Non-smoking rooms available'
      },
      highlights: ['Great Location', 'Friendly Staff', 'Clean Rooms', 'Good Value'],
      nearby: ['Local attractions nearby', 'Restaurants within walking distance']
    }
  }
  
  return null
}
