
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchCuratedLuxuryHotels, getHotelTypeIntroduction } from '@/services/curatedHotelService'
import HotelCard from './HotelCard'
import { Loader2, Sparkles, Star, Heart, Waves } from 'lucide-react'
import { Hotel } from '@/types/hotel'

const CuratedHotelDisplay: React.FC = () => {
  const { data: hotels = [], isLoading, error } = useQuery({
    queryKey: ['curated-luxury-hotels'],
    queryFn: fetchCuratedLuxuryHotels,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
        <span className="ml-3 text-lg text-gray-600">Discovering amazing hotels for you...</span>
      </div>
    )
  }

  if (error || hotels.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-400 text-6xl mb-4">🏨</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No hotels available</h3>
        <p className="text-gray-600">Please try searching for specific hotels or locations.</p>
      </div>
    )
  }

  // Group hotels by type for better presentation
  const groupedHotels = hotels.reduce((acc, hotel) => {
    const type = hotel.hotel_type || 'middle_range'
    if (!acc[type]) acc[type] = []
    acc[type].push(hotel)
    return acc
  }, {} as Record<string, Hotel[]>)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'luxury_resort': return <Star className="w-6 h-6 text-yellow-500" />
      case 'boutique': return <Heart className="w-6 h-6 text-pink-500" />
      case 'cabana': return <Waves className="w-6 h-6 text-blue-500" />
      default: return <Sparkles className="w-6 h-6 text-teal-500" />
    }
  }

  const getTypeTitle = (type: string) => {
    switch (type) {
      case 'luxury_resort': return 'Luxury Resorts'
      case 'boutique': return 'Boutique Hotels'
      case 'middle_range': return 'Premium Hotels'
      case 'cabana': return 'Beach Cabanas'
      case 'wellness': return 'Wellness Retreats'
      default: return 'Featured Hotels'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4 font-playfair">
          Discover Sri Lanka's Finest Hotels
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          From luxury resorts to charming boutique properties, explore our curated selection 
          of exceptional accommodations across the Pearl of the Indian Ocean.
        </p>
      </div>

      {Object.entries(groupedHotels).map(([type, typeHotels]) => (
        <div key={type} className="mb-16">
          <div className="flex items-center mb-6">
            {getTypeIcon(type)}
            <h3 className="text-2xl font-bold text-gray-900 ml-3 font-playfair">
              {getTypeTitle(type)}
            </h3>
          </div>
          
          <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-6 mb-8">
            <p className="text-gray-700 text-lg leading-relaxed">
              {getHotelTypeIntroduction(type)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {typeHotels.slice(0, 4).map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>

          {typeHotels.length > 4 && (
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                And {typeHotels.length - 4} more amazing {getTypeTitle(type).toLowerCase()}...
              </p>
            </div>
          )}
        </div>
      ))}

      <div className="text-center mt-12 bg-gradient-to-r from-teal-green to-ceylon-blue text-white rounded-lg p-8">
        <Sparkles className="w-12 h-12 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-3">Looking for Something Specific?</h3>
        <p className="text-lg opacity-90">
          Use our search bar above to find hotels by name, location, or preferences. 
          We'll help you discover the perfect accommodation for your Sri Lankan adventure!
        </p>
      </div>
    </div>
  )
}

export default CuratedHotelDisplay
