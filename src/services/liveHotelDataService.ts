
import { dbService, authService, storageService } from '@/lib/firebase-services'
import { Hotel } from '@/types/hotel'

interface LiveHotelData {
  id: string
  name: string
  images: string[]
  current_price: number
  availability: boolean
  rating: number
  reviews_count: number
}

export const liveHotelDataService = {
  async fetchLiveHotelData(hotelId: string): Promise<LiveHotelData | null> {
    try {
      // Generate realistic live data based on hotel ID for consistency
      return this.generateMockLiveData(hotelId)
    } catch (error) {
      console.error('Error fetching live hotel data:', error)
      return this.generateMockLiveData(hotelId)
    }
  },

  generateMockLiveData(hotelId: string): LiveHotelData {
    // Generate consistent data based on hotel ID
    const hashCode = (str: string) => {
      let hash = 0
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash
      }
      return Math.abs(hash)
    }

    const hotelHash = hashCode(hotelId)
    
    // Expanded and more diverse image pools
    const luxuryResortImages = [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'
    ]

    const beachHotelImages = [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?w=800&h=600&fit=crop'
    ]

    const boutiqueHotelImages = [
      'https://images.unsplash.com/photo-1578645510447-e20b4311e3ce?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1566195992011-5f6b21e539aa?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop'
    ]

    const budgetHotelImages = [
      'https://images.unsplash.com/photo-1590490359683-658d3d23f972?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1559599238-1a81cbe946c1?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1522798514-97ceb8c4ea54?w=800&h=600&fit=crop'
    ]

    const mountainLodgeImages = [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop'
    ]

    // Select image category based on hotel hash
    const imageCategories = [luxuryResortImages, beachHotelImages, boutiqueHotelImages, budgetHotelImages, mountainLodgeImages]
    const categoryIndex = hotelHash % imageCategories.length
    const selectedCategory = imageCategories[categoryIndex]

    // Generate 2-4 unique images from the selected category
    const imageCount = (hotelHash % 3) + 2 // 2-4 images
    const selectedImages: string[] = []
    
    // Use different starting points to ensure variety
    const startIndex = hotelHash % selectedCategory.length
    for (let i = 0; i < imageCount; i++) {
      const imageIndex = (startIndex + i) % selectedCategory.length
      selectedImages.push(selectedCategory[imageIndex])
    }

    // Generate varied prices based on category and hotel ID
    const basePrices = {
      0: [280, 350, 420, 500, 380], // luxury resort
      1: [150, 220, 280, 320, 190], // beach hotel
      2: [180, 250, 320, 380, 220], // boutique
      3: [45, 75, 95, 120, 85],     // budget
      4: [120, 180, 240, 300, 160]  // mountain lodge
    }

    const categoryPrices = basePrices[categoryIndex as keyof typeof basePrices] || basePrices[3]
    const priceIndex = (hotelHash + 7) % categoryPrices.length
    const basePrice = categoryPrices[priceIndex]
    
    // Add some variation to the base price
    const priceVariation = ((hotelHash % 100) - 50) * 0.3 // ±15 variation
    const currentPrice = Math.max(Math.round(basePrice + priceVariation), 25)

    return {
      id: hotelId,
      name: '',
      images: selectedImages,
      current_price: currentPrice,
      availability: (hotelHash % 10) !== 0, // 90% availability
      rating: Math.round(((hotelHash % 20) / 10 + 3.5) * 10) / 10, // 3.5-5.0 rating
      reviews_count: (hotelHash % 400) + 50
    }
  },

  async enrichHotelsWithLiveData(hotels: Hotel[]): Promise<Hotel[]> {
    const enrichedHotels = await Promise.all(
      hotels.map(async (hotel) => {
        const liveData = await this.fetchLiveHotelData(hotel.id)
        
        if (liveData) {
          return {
            ...hotel,
            images: liveData.images.map((url, index) => ({
              id: `${hotel.id}-live-${index}`,
              hotel_id: hotel.id,
              image_url: url,
              is_primary: index === 0,
              sort_order: index
            })),
            base_price_per_night: liveData.current_price,
            average_rating: liveData.rating,
            review_count: liveData.reviews_count,
            is_active: liveData.availability
          }
        }
        
        return hotel
      })
    )
    
    return enrichedHotels
  }
}
