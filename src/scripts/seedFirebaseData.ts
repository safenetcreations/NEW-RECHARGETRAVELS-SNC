import { db } from '@/lib/firebase'
import { collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore'

const sampleTours = [
  {
    title: "Sigiriya & Dambulla Day Tour",
    description: "Explore the ancient rock fortress of Sigiriya and the golden temple of Dambulla on this unforgettable day tour. Climb the iconic Lion Rock and discover ancient frescoes and ruins.",
    duration_days: 1,
    price_per_person: 85,
    category: "cultural",
    destination: "Sigiriya",
    difficulty_level: "moderate",
    max_group_size: 15,
    included_items: [
      "Professional English-speaking guide",
      "Air-conditioned vehicle",
      "Entrance fees to all sites",
      "Lunch at local restaurant",
      "Bottled water"
    ],
    excluded_items: [
      "Personal expenses",
      "Tips and gratuities",
      "Travel insurance"
    ],
    itinerary: [
      {
        day: 1,
        title: "Sigiriya & Dambulla Adventure",
        activities: [
          "6:00 AM - Pick up from hotel",
          "9:00 AM - Arrive at Sigiriya Rock Fortress",
          "12:00 PM - Lunch break",
          "2:00 PM - Visit Dambulla Cave Temple",
          "5:00 PM - Return to hotel"
        ]
      }
    ],
    images: [
      "https://images.unsplash.com/photo-1584981358663-ad30f30dc4a2?w=800&h=600&fit=crop"
    ],
    rating: 4.8,
    is_active: true
  },
  {
    title: "Yala National Park Safari",
    description: "Experience the thrill of spotting leopards, elephants, and exotic birds in Sri Lanka's most famous national park. Our experienced guides will ensure you have the best wildlife viewing opportunities.",
    duration_days: 1,
    price_per_person: 120,
    category: "wildlife",
    destination: "Yala",
    difficulty_level: "easy",
    max_group_size: 6,
    included_items: [
      "4x4 Safari jeep",
      "Professional wildlife guide",
      "Park entrance fees",
      "Breakfast and lunch",
      "Binoculars"
    ],
    excluded_items: [
      "Accommodation",
      "Alcoholic beverages",
      "Personal expenses"
    ],
    itinerary: [
      {
        day: 1,
        title: "Full Day Safari Adventure",
        activities: [
          "5:00 AM - Early morning pick up",
          "6:00 AM - Enter Yala National Park",
          "8:00 AM - Breakfast in the park",
          "12:00 PM - Lunch break",
          "3:00 PM - Exit park and return"
        ]
      }
    ],
    images: [
      "https://images.unsplash.com/photo-1561971978-17f98e1a17a9?w=800&h=600&fit=crop"
    ],
    rating: 4.9,
    is_active: true
  },
  {
    title: "Galle & South Coast Tour",
    description: "Discover the colonial charm of Galle Fort, relax on pristine beaches, and visit a turtle hatchery on this coastal adventure.",
    duration_days: 1,
    price_per_person: 75,
    category: "beach",
    destination: "Galle",
    difficulty_level: "easy",
    max_group_size: 20,
    included_items: [
      "Transportation in AC vehicle",
      "English-speaking guide",
      "Galle Fort walking tour",
      "Turtle hatchery visit",
      "Traditional lunch"
    ],
    excluded_items: [
      "Beach activities",
      "Shopping expenses",
      "Additional meals"
    ],
    itinerary: [
      {
        day: 1,
        title: "Coastal Heritage Tour",
        activities: [
          "7:00 AM - Hotel pick up",
          "9:30 AM - Explore Galle Fort",
          "12:00 PM - Lunch at beach restaurant",
          "2:00 PM - Visit turtle hatchery",
          "4:00 PM - Beach time",
          "6:00 PM - Return journey"
        ]
      }
    ],
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc3e?w=800&h=600&fit=crop"
    ],
    rating: 4.7,
    is_active: true
  }
]

const sampleHotels = [
  {
    name: "Cinnamon Grand Colombo",
    description: "A luxury 5-star hotel in the heart of Colombo, offering world-class amenities and exceptional service.",
    star_rating: 5,
    hotel_type: "luxury",
    base_price_per_night: 180,
    country: "Sri Lanka",
    latitude: 6.9271,
    longitude: 79.8437,
    address: "77 Galle Road, Colombo 00300",
    phone: "+94 11 243 7437",
    amenities: ["Swimming Pool", "Spa", "Fitness Center", "Restaurant", "Bar", "WiFi", "Parking"],
    is_active: true,
    city: {
      name: "Colombo",
      country: "Sri Lanka"
    }
  },
  {
    name: "Jetwing Yala",
    description: "An eco-luxury resort situated at the doorstep of Yala National Park, perfect for wildlife enthusiasts.",
    star_rating: 5,
    hotel_type: "resort",
    base_price_per_night: 220,
    country: "Sri Lanka",
    latitude: 6.3654,
    longitude: 81.4818,
    address: "Yala, Kirinda",
    phone: "+94 47 739 0400",
    amenities: ["Pool", "Wildlife Tours", "Spa", "Restaurant", "Bar", "WiFi", "Nature Walks"],
    is_active: true,
    city: {
      name: "Yala",
      country: "Sri Lanka"
    }
  },
  {
    name: "98 Acres Resort & Spa",
    description: "A stunning hillside resort in Ella offering breathtaking views of the surrounding mountains and tea plantations.",
    star_rating: 4,
    hotel_type: "resort",
    base_price_per_night: 150,
    country: "Sri Lanka",
    latitude: 6.8667,
    longitude: 81.0467,
    address: "Greenland Estate, Ella",
    phone: "+94 57 205 0050",
    amenities: ["Infinity Pool", "Spa", "Restaurant", "Trekking", "Tea Tours", "WiFi"],
    is_active: true,
    city: {
      name: "Ella",
      country: "Sri Lanka"
    }
  }
]

export const seedFirebaseData = async () => {
  try {
    console.log('Starting to seed Firebase data...')
    
    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('Clearing existing data...')
    const toursSnapshot = await getDocs(collection(db, 'tours'))
    const hotelsSnapshot = await getDocs(collection(db, 'hotels'))
    
    const deletePromises = [
      ...toursSnapshot.docs.map(doc => deleteDoc(doc.ref)),
      ...hotelsSnapshot.docs.map(doc => deleteDoc(doc.ref))
    ]
    
    await Promise.all(deletePromises)
    
    // Add sample tours
    console.log('Adding sample tours...')
    for (const tour of sampleTours) {
      await addDoc(collection(db, 'tours'), {
        ...tour,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    }
    
    // Add sample hotels
    console.log('Adding sample hotels...')
    for (const hotel of sampleHotels) {
      await addDoc(collection(db, 'hotels'), {
        ...hotel,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    }
    
    console.log('✅ Firebase data seeded successfully!')
    return { success: true }
  } catch (error) {
    console.error('Error seeding Firebase data:', error)
    return { success: false, error }
  }
}