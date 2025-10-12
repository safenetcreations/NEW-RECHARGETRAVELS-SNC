import { firebaseHotelService } from './firebaseHotelService'
import { Hotel } from '@/types/hotel'

export const hotelDataService = {
  async getAllHotels(): Promise<Hotel[]> {
    try {
      return await firebaseHotelService.getAllHotels()
    } catch (error) {
      console.error('Error fetching hotels:', error)
      return []
    }
  },

  async searchHotels(query: string): Promise<Hotel[]> {
    try {
      const allHotels = await firebaseHotelService.getAllHotels()
      
      // Filter hotels based on query
      const filteredHotels = allHotels.filter(hotel => {
        const searchText = query.toLowerCase()
        return (
          hotel.name.toLowerCase().includes(searchText) ||
          hotel.description.toLowerCase().includes(searchText) ||
          hotel.city?.name?.toLowerCase().includes(searchText) ||
          hotel.address.toLowerCase().includes(searchText)
        )
      })
      
      return filteredHotels
    } catch (error) {
      console.error('Error searching hotels:', error)
      return []
    }
  },

  async getHotelById(hotelId: string): Promise<Hotel | null> {
    try {
      return await firebaseHotelService.getHotelById(hotelId)
    } catch (error) {
      console.error('Error fetching hotel by ID:', error)
      return null
    }
  },

  async getHotelsByDestination(destination: string): Promise<Hotel[]> {
    try {
      return await firebaseHotelService.searchHotels({ destination })
    } catch (error) {
      console.error('Error fetching hotels by destination:', error)
      return []
    }
  },

  async getHotelsByPriceRange(minPrice: number, maxPrice: number): Promise<Hotel[]> {
    try {
      return await firebaseHotelService.searchHotels({ minPrice, maxPrice })
    } catch (error) {
      console.error('Error fetching hotels by price range:', error)
      return []
    }
  },

  async getHotelsByStarRating(starRating: number): Promise<Hotel[]> {
    try {
      return await firebaseHotelService.searchHotels({ starRating })
    } catch (error) {
      console.error('Error fetching hotels by star rating:', error)
      return []
    }
  },

  async getHotelsByType(hotelType: string): Promise<Hotel[]> {
    try {
      return await firebaseHotelService.searchHotels({ hotelType })
    } catch (error) {
      console.error('Error fetching hotels by type:', error)
      return []
    }
  }
}