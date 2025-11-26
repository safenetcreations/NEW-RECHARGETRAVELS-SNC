
import React from 'react'
import { 
  MapPin, Clock, Users, Heart, Share2
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tour } from '@/types/tour'

interface TourCardProps {
  tour: Tour
  onViewDetails: (tour: Tour) => void
  onBookTour: (tour: Tour) => void
}

const tourTypeIcons = {
  'adventure': '🏔️',
  'cultural': '🏛️',
  'wildlife': '🦎',
  'luxury': '⭐',
  'budget': '💰',
  'family': '👨‍👩‍👧‍👦'
}

const difficultyColors = {
  'easy': 'bg-green-100 text-green-800',
  'moderate': 'bg-yellow-100 text-yellow-800',
  'challenging': 'bg-orange-100 text-orange-800',
  'extreme': 'bg-red-100 text-red-800'
}

const TourCard: React.FC<TourCardProps> = ({ tour, onViewDetails, onBookTour }) => {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <img 
          src={tour.images?.[0] || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'} 
          alt={tour.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          <Badge className={difficultyColors[tour.difficulty_level]}>
            {tour.difficulty_level}
          </Badge>
        </div>
        <div className="absolute top-4 right-4 flex space-x-2">
          <Button size="sm" variant="secondary" className="bg-white bg-opacity-90 hover:bg-opacity-100">
            <Heart className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="secondary" className="bg-white bg-opacity-90 hover:bg-opacity-100">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center mb-2">
          <span className="text-lg mr-2">{tourTypeIcons[tour.tour_type]}</span>
          <span className="text-sm text-blue-600 font-medium capitalize">{tour.tour_type}</span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">{tour.title}</h3>
        
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{tour.destination}</span>
        </div>
        
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">{tour.description}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>{tour.duration_days} days</span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            <span>Max {tour.max_participants}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <span className="text-2xl font-bold text-green-600">${tour.price_per_person}</span>
            <span className="text-gray-600 text-sm">/person</span>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => onViewDetails(tour)}
            >
              View Details
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => onBookTour(tour)}
            >
              Book Tour
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default TourCard
