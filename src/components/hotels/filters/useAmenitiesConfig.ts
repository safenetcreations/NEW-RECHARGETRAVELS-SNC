
import React from 'react'
import { AmenityConfig } from './types'
import { fallbackAmenitiesConfig, getIconByName } from './constants'
import { Wifi } from 'lucide-react'

type AmenityData = {
  id: string
  name: string
  category: string
  icon: string | null
  description: string | null
}

export const useAmenitiesConfig = (amenities: AmenityData[]): AmenityConfig[] => {
  return React.useMemo(() => {
    if (!amenities?.length) {
      return fallbackAmenitiesConfig
    }
    
    return amenities.map(amenity => ({
      value: amenity.name,
      label: amenity.name,
      icon: getIconByName(amenity.icon) || Wifi,
      category: amenity.category || 'general'
    }))
  }, [amenities])
}
