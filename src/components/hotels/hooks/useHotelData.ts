
import { useState, useEffect } from 'react'
import type { FiltersState } from '../types/filterTypes'
import type { Hotel } from '@/types/hotel'
import { fetchLocalHotels } from '../services/localHotelService'
import { fetchGoogleHotels } from '../services/googleHotelService'

export const useHotelData = (searchQuery: string, filters: FiltersState) => {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(false)
  const [usingGoogleAPI, setUsingGoogleAPI] = useState(false)

  useEffect(() => {
    fetchHotels()
  }, [filters, searchQuery])

  const fetchHotels = async () => {
    setLoading(true)
    try {
      const localHotels = await fetchLocalHotels(searchQuery, filters)
      
      if (localHotels.length === 0 && searchQuery.trim()) {
        console.log('No local results found, trying Google Hotels API...')
        setUsingGoogleAPI(true)
        const googleHotels = await fetchGoogleHotels(searchQuery, filters)
        setHotels(googleHotels)
        console.log(`Found ${googleHotels.length} Sri Lankan hotels via Google API`)
      } else {
        setHotels(localHotels)
        setUsingGoogleAPI(false)
        console.log(`Found ${localHotels.length} Sri Lankan hotels in local database`)
      }
    } catch (error) {
      console.error('Error fetching hotels:', error)
      setUsingGoogleAPI(false)
      setHotels([])
    } finally {
      setLoading(false)
    }
  }

  return {
    hotels,
    loading,
    usingGoogleAPI,
    refetch: fetchHotels
  }
}
