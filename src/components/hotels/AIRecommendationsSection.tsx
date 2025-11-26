
import React from 'react'
import { Sparkles } from 'lucide-react'
import HotelSearchCard from './HotelSearchCard'

interface Hotel {
  id: string
  name: string
  description?: string
  star_rating?: number
  hotel_type?: string
  location?: string
  city?: string
  amenities?: string[]
  ai_recommendation_score?: number
  room_types?: Array<{
    price_per_night: number
  }>
  images?: string[]
  averageRating?: number
  reviewCount?: number
}

interface AIRecommendationsSectionProps {
  recommendations: Hotel[]
}

const AIRecommendationsSection: React.FC<AIRecommendationsSectionProps> = ({
  recommendations
}) => {
  if (recommendations.length === 0) return null

  return (
    <div className="mb-8">
      <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <Sparkles className="w-6 h-6 mr-2 text-purple-600" />
          AI Recommendations for You
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((hotel) => (
            <HotelSearchCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default AIRecommendationsSection
