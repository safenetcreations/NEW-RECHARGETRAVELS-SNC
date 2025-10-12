
import { Wifi, Waves, Heart, Dumbbell, Utensils, Coffee, Car, Shield, Briefcase, Building } from 'lucide-react'
import { HotelType, AmenityConfig } from './types'

export const hotelTypes: HotelType[] = [
  { value: 'luxury_resort', label: 'Luxury Resort', icon: '🏖️', color: 'bg-purple-100 text-purple-800' },
  { value: 'cabana', label: 'Cabana', icon: '🏕️', color: 'bg-green-100 text-green-800' },
  { value: 'budget', label: 'Budget Hotel', icon: '🏨', color: 'bg-blue-100 text-blue-800' },
  { value: 'middle_range', label: 'Mid-Range', icon: '🏩', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'boutique', label: 'Boutique', icon: '🏛️', color: 'bg-pink-100 text-pink-800' }
]

export const fallbackAmenitiesConfig: AmenityConfig[] = [
  { value: 'Free WiFi', label: 'Free WiFi', icon: Wifi, category: 'connectivity' },
  { value: 'Swimming Pool', label: 'Swimming Pool', icon: Waves, category: 'recreation' },
  { value: 'Spa Services', label: 'Spa & Wellness', icon: Heart, category: 'wellness' },
  { value: 'Fitness Center', label: 'Fitness Center', icon: Dumbbell, category: 'fitness' },
  { value: 'Restaurant', label: 'Restaurant', icon: Utensils, category: 'dining' },
  { value: 'Room Service', label: 'Room Service', icon: Coffee, category: 'dining' },
  { value: 'Parking', label: 'Free Parking', icon: Car, category: 'convenience' },
  { value: 'Airport Shuttle', label: 'Airport Shuttle', icon: Shield, category: 'convenience' },
  { value: 'Business Center', label: 'Business Center', icon: Briefcase, category: 'business' },
  { value: 'Concierge', label: 'Concierge', icon: Building, category: 'service' }
]

export const accessibilityOptions = [
  'Wheelchair Accessible', 'Elevator Access', 'Accessible Bathroom',
  'Braille/Audio Aids', 'Service Animals Allowed'
]

export const propertyFeatures = [
  'Beach Access', 'Mountain View', 'City Center', 'Airport Shuttle',
  'Conference Facilities', 'Wedding Venue', 'Golf Course', 'Spa Services'
]

// Helper function to get icon by name
export function getIconByName(iconName?: string) {
  const iconMap: Record<string, any> = {
    'wifi': Wifi,
    'waves': Waves,
    'heart': Heart,
    'dumbbell': Dumbbell,
    'utensils': Utensils,
    'coffee': Coffee,
    'car': Car,
    'shield': Shield,
    'briefcase': Briefcase,
    'building': Building
  }
  return iconName ? iconMap[iconName.toLowerCase()] : null
}
