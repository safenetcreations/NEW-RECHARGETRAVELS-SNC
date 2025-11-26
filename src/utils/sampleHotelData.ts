
import { dbService, authService, storageService } from '@/lib/firebase-services'

export const insertSampleHotels = async () => {
  const sampleHotels = [
    {
      name: "Galle Face Hotel",
      description: "Historic luxury hotel overlooking the Indian Ocean in Colombo",
      star_rating: 5,
      hotel_type: "luxury_resort",
      base_price_per_night: 250,
      country: "Sri Lanka",
      latitude: 6.9271,
      longitude: 79.8612,
      amenities: ["WiFi", "Pool", "Spa", "Restaurant", "Bar"],
      address: "2 Kollupitiya Rd, Colombo 00300",
      phone: "+94 11 254 1010",
      is_active: true
    },
    {
      name: "Heritance Kandalama",
      description: "Eco-friendly luxury resort built into a rock face in Dambulla",
      star_rating: 5,
      hotel_type: "luxury_resort", 
      base_price_per_night: 180,
      country: "Sri Lanka",
      latitude: 7.8554,
      longitude: 80.6486,
      amenities: ["WiFi", "Pool", "Spa", "Restaurant", "Nature Walks"],
      address: "Kandalama, Dambulla",
      phone: "+94 66 555 5000",
      is_active: true
    },
    {
      name: "The Fortress Resort & Spa",
      description: "Stunning clifftop resort in Koggala with panoramic ocean views",
      star_rating: 5,
      hotel_type: "luxury_resort",
      base_price_per_night: 320,
      country: "Sri Lanka", 
      latitude: 5.9939,
      longitude: 80.3267,
      amenities: ["WiFi", "Pool", "Spa", "Restaurant", "Beach Access"],
      address: "Koggala, Galle",
      phone: "+94 91 438 9400",
      is_active: true
    },
    {
      name: "Cinnamon Grand Colombo",
      description: "Premium city hotel in the heart of Colombo",
      star_rating: 4,
      hotel_type: "middle_range",
      base_price_per_night: 120,
      country: "Sri Lanka",
      latitude: 6.9147,
      longitude: 79.8747,
      amenities: ["WiFi", "Pool", "Gym", "Restaurant", "Business Center"],
      address: "77 Galle Rd, Colombo 03",
      phone: "+94 11 249 7973",
      is_active: true
    }
  ]

  try {
    const { data, error } = await supabase
      .from('hotels')
      .insert(sampleHotels)
      .select()

    if (error) {
      console.error('Error inserting sample hotels:', error)
      return { success: false, error }
    }

    console.log('Sample hotels inserted successfully:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Error in insertSampleHotels:', error)
    return { success: false, error }
  }
}
