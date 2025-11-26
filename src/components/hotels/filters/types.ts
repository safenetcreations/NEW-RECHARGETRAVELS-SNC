
export interface SectionState {
  price: boolean
  rating: boolean
  type: boolean
  amenities: boolean
  location: boolean
  advanced: boolean
  presets: boolean
}

export interface HotelType {
  value: string
  label: string
  icon: string
  color: string
}

export interface AmenityConfig {
  value: string
  label: string
  icon: any
  category: string
}
