
import { useQuery } from '@tanstack/react-query'
import { dbService, authService, storageService } from '@/lib/firebase-services'

// Simple, explicit types to avoid deep type instantiation
export type AmenityData = {
  id: string
  name: string
  category: string
  icon: string | null
  description: string | null
}

export type CityData = {
  id: string
  name: string
  country: string
}

const fetchAmenities = async (): Promise<AmenityData[]> => {
  try {
    // Use completely untyped approach to bypass TypeScript inference
    const response = await (supabase as any)
      .from('hotel_amenities')
      .select('id, name, category, icon, description')
      .eq('is_active', true)
      .order('category, name')
    
    if (response.error) {
      console.error('Error fetching amenities:', response.error)
      return []
    }
    
    // Simple type assertion to avoid complex inference
    const amenities: AmenityData[] = response.data?.map((item: any) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      icon: item.icon,
      description: item.description
    })) || []
    
    return amenities
  } catch (error) {
    console.error('Error fetching amenities:', error)
    return []
  }
}

const fetchCities = async (): Promise<CityData[]> => {
  try {
    // Use completely untyped approach to bypass TypeScript inference
    const response = await (supabase as any)
      .from('cities')
      .select('id, name, country')
      .order('name')
    
    if (response.error) {
      console.error('Error fetching cities:', response.error)
      return []
    }
    
    // Simple type assertion to avoid complex inference
    const cities: CityData[] = response.data?.map((item: any) => ({
      id: item.id,
      name: item.name,
      country: item.country
    })) || []
    
    return cities
  } catch (error) {
    console.error('Error fetching cities:', error)
    return []
  }
}

export const useHotelFilterData = () => {
  const amenitiesQuery = useQuery({
    queryKey: ['hotel-amenities-simple'],
    queryFn: fetchAmenities
  })

  const citiesQuery = useQuery({
    queryKey: ['cities-simple'],
    queryFn: fetchCities
  })

  return {
    amenities: amenitiesQuery.data || [],
    cities: citiesQuery.data || [],
    isLoadingAmenities: amenitiesQuery.isLoading,
    isLoadingCities: citiesQuery.isLoading
  }
}
